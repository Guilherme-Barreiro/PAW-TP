import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  dishes: any[] = [];
  selectedCategory: string = 'Todas';
  categories: string[] = ['Todas', 'Carne', 'Peixe', 'Vegetariano', 'Sobremesa'];
  restaurantId: string = '';

  novoPrato: any = {
    name: '',
    category: 'Carne',
    description: '',
    tempoPreparacao: 15,
    price: { meia: 0, inteira: 0 },
    nutrition: ''
  };
  selectedImage: File | null = null;

  editIndex: number | null = null;
  editedDish: any = null;
  editImage: File | null = null;

  constructor(
    private menuService: MenuService,
    private cartService: CartService,
    private authService: AuthService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    const ownerId = this.authService.getUserId();
    if (!ownerId) return;

    this.restaurantService.getRestaurantsByOwner(ownerId).subscribe({
      next: (restaurants) => {
        if (restaurants.length === 0) return;
        this.restaurantId = restaurants[0]._id;
        this.loadMenu();
      }
    });
  }

  loadMenu(): void {
    this.menuService.getMenu(this.restaurantId).subscribe({
      next: (menu) => this.dishes = menu,
      error: (err) => console.error('Erro ao carregar menu:', err)
    });
  }

  getFilteredDishes(): any[] {
    if (this.selectedCategory === 'Todas') return this.dishes;
    return this.dishes.filter(d => d.category === this.selectedCategory);
  }

  addToCart(dish: any): void {
    this.cartService.addItem({
      dishId: dish._id,
      name: dish.name,
      price: dish.price?.inteira ?? 0,
      quantity: 1
    });
    alert(`${dish.name} adicionado ao carrinho.`);
  }

  onFileSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  addDish(): void {
    if (this.dishes.length >= 10) {
      alert('❌ Menu completo (máx. 10 pratos).');
      return;
    }

    const formData = new FormData();
    for (const key in this.novoPrato) {
      if (key !== 'price') {
        formData.append(key, this.novoPrato[key]);
      }
    }
    formData.append('price_meia', this.novoPrato.price.meia.toString());
    formData.append('price_inteira', this.novoPrato.price.inteira.toString());
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.menuService.addDish(this.restaurantId, formData).subscribe({
      next: () => {
        alert('✅ Prato adicionado!');
        this.resetForm();
        this.loadMenu();
      },
      error: (err) => alert(err.error?.error || 'Erro ao adicionar prato.')
    });
  }

  resetForm(): void {
    this.novoPrato = {
      name: '',
      category: 'Carne',
      description: '',
      tempoPreparacao: 15,
      price: { meia: 0, inteira: 0 },
      nutrition: ''
    };
    this.selectedImage = null;
  }

  removeDish(index: number): void {
    if (!confirm('Desejas mesmo remover este prato?')) return;

    this.menuService.removeDish(this.restaurantId, index).subscribe({
      next: () => this.loadMenu(),
      error: () => alert('Erro ao remover prato.')
    });
  }

  startEdit(index: number): void {
    this.editIndex = index;
    this.editedDish = JSON.parse(JSON.stringify(this.dishes[index])); // deep copy
    this.editImage = null;
  }

  cancelEdit(): void {
    this.editIndex = null;
    this.editedDish = null;
    this.editImage = null;
  }

  onEditImageSelected(event: any): void {
    this.editImage = event.target.files[0];
  }

saveEdit(index: number): void {
  if (!this.editedDish || !this.restaurantId) return;

  // Validações simples
  const { name, price } = this.editedDish;
  if (!name || name.trim().length < 2) {
    alert('❌ O nome do prato deve ter pelo menos 2 caracteres.');
    return;
  }

  if (!price || price.meia < 0 || price.inteira < 0) {
    alert('❌ Os preços devem ser números positivos.');
    return;
  }

  this.menuService.updateDish(this.restaurantId, index, this.editedDish).subscribe({
    next: () => {
      if (this.editImage) {
        this.menuService.uploadDishImage(this.restaurantId, index, this.editImage).subscribe({
          next: () => this.finishEdit(),
          error: () => alert('Erro ao atualizar imagem.')
        });
      } else {
        this.finishEdit();
      }
    },
    error: () => alert('Erro ao atualizar prato.')
  });
}

sortOption: string = 'nome-asc';

sortDishes(): void {
  const sorted = [...this.dishes]; // cópia
  switch (this.sortOption) {
    case 'nome-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'nome-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'preco-asc':
      sorted.sort((a, b) => (a.price?.inteira ?? 0) - (b.price?.inteira ?? 0));
      break;
    case 'preco-desc':
      sorted.sort((a, b) => (b.price?.inteira ?? 0) - (a.price?.inteira ?? 0));
      break;
  }
  this.dishes = sorted;
}

  finishEdit(): void {
    this.editIndex = null;
    this.editedDish = null;
    this.editImage = null;
    alert('✅ Prato atualizado com sucesso.');
    this.loadMenu();
  }
}
