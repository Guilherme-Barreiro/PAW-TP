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

  editedDish: any = {};
  editIndex: number | null = null;
  selectedDose: { [index: number]: 'meia' | 'inteira' } = {};
  selectedImage: File | null = null;

  constructor(
    private menuService: MenuService,
    private cartService: CartService,
    private authService: AuthService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    const ownerId = this.authService.getUserId();
    if (!ownerId) {
      console.error('Utilizador não autenticado.');
      return;
    }

    this.restaurantService.getRestaurantsByOwner(ownerId).subscribe({
      next: (restaurants) => {
        if (restaurants.length === 0) {
          console.warn('Nenhum restaurante encontrado.');
          return;
        }

        this.restaurantId = restaurants[0]._id;
        this.loadMenu();
      },
      error: (err) => {
        console.error('Erro ao buscar restaurantes do utilizador:', err);
      }
    });
  }

  loadMenu(): void {
    this.menuService.getMenu(this.restaurantId).subscribe({
      next: (menu) => {
        this.dishes = menu;
        this.dishes.forEach((_, i) => this.selectedDose[i] = 'inteira');
      },
      error: (err) => {
        console.error('Erro ao carregar menu:', err);
      }
    });
  }

  getFilteredDishes(): any[] {
    if (this.selectedCategory === 'Todas') return this.dishes;
    return this.dishes.filter(d => d.category === this.selectedCategory);
  }

  addToCart(dish: any, dose: 'meia' | 'inteira' = 'inteira'): void {
    const price = dose === 'meia' ? dish.price?.meia : dish.price?.inteira;

    this.cartService.addItem({
      dishId: dish._id,
      name: `${dish.name} (${dose === 'meia' ? 'Meia Dose' : 'Inteira'})`,
      price: price ?? 0,
      quantity: 1
    });

    console.log(`${dish.name} (${dose}) adicionado ao carrinho.`);
  }

  startEdit(index: number): void {
    this.editIndex = index;
    this.editedDish = { ...this.dishes[index] };
  }

  cancelEdit(): void {
    this.editIndex = null;
    this.editedDish = {};
  }

  saveEdit(index: number): void {
    this.menuService.updateDish(this.restaurantId, index, this.editedDish).subscribe({
      next: () => {
        if (this.selectedImage) {
          this.menuService.uploadDishImage(this.restaurantId, index, this.selectedImage).subscribe(() => {
            this.loadMenu();
            this.cancelEdit();
          });
        } else {
          this.loadMenu();
          this.cancelEdit();
        }
      },
      error: (err) => {
        console.error('Erro ao atualizar prato:', err);
        alert('Erro ao guardar alterações.');
      }
    });
  }

  onEditImageSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  removeDish(index: number): void {
    if (confirm('Tens a certeza que queres remover este prato?')) {
      this.menuService.removeDish(this.restaurantId, index).subscribe(() => this.loadMenu());
    }
  }
}
