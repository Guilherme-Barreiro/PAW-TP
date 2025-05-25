import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  restaurants: any[] = [];
  selectedRestaurantId: string = '';
  dishes: any[] = [];
  selectedCategory: string = 'Todas';
  categories: string[] = ['Todas', 'Carne', 'Peixe', 'Vegetariano', 'Sobremesa'];

  editedDish: any = {};
  editIndex: number | null = null;
  selectedDose: { [index: number]: 'meia' | 'inteira' } = {};
  selectedImage: File | null = null;

  constructor(
    private menuService: MenuService,
    private cartService: CartService,
    private authService: AuthService,
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const ownerId = this.authService.getUserId();
    if (!ownerId) {
      console.error('Utilizador não autenticado.');
      return;
    }

    this.restaurantService.getRestaurantsByOwner(ownerId).subscribe({
      next: (restaurants) => {
        this.restaurants = restaurants.filter(r => r.status === 'validado');
        if (this.restaurants.length > 0) {
          this.selectedRestaurantId = this.restaurants[0]._id;
          this.loadMenu(this.selectedRestaurantId);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar restaurantes:', err);
      }
    });
  }

  loadMenu(restaurantId: string): void {
    this.menuService.getMenu(restaurantId).subscribe({
      next: (menu) => {
        this.dishes = menu;
        this.selectedDose = {};
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

  canAddDish(): boolean {
    return this.dishes.length < 10;
  }

  goToAddDish(): void {
    if (!this.selectedRestaurantId) {
      alert("Seleciona um restaurante primeiro.");
      return;
    }

    this.router.navigate(['/menu/add'], {
      queryParams: { restaurantId: this.selectedRestaurantId }
    });
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
    this.menuService.updateDish(this.selectedRestaurantId, index, this.editedDish).subscribe({
      next: () => {
        if (this.selectedImage) {
          this.menuService.uploadDishImage(this.selectedRestaurantId, index, this.selectedImage).subscribe(() => {
            this.loadMenu(this.selectedRestaurantId);
            this.cancelEdit();
          });
        } else {
          this.loadMenu(this.selectedRestaurantId);
          this.cancelEdit();
        }
      },
      error: (err) => {
        console.error('Erro ao guardar alterações:', err);
        alert('Erro ao guardar prato.');
      }
    });
  }

  onEditImageSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  removeDish(index: number): void {
    if (confirm('Tens a certeza que queres remover este prato?')) {
      this.menuService.removeDish(this.selectedRestaurantId, index).subscribe(() => {
        this.loadMenu(this.selectedRestaurantId);
      });
    }
  }

  addToCart(dish: any, dose: 'meia' | 'inteira' = 'inteira'): void {
    const price = dose === 'meia' ? dish.price?.meia : dish.price?.inteira;
    this.cartService.addItem({
      dishId: dish._id,
      name: dish.name,
      price,
      quantity: 1,
      tipo: dose
    });
  }

  editarRestaurante(id: string): void {
  this.router.navigate(['/restaurants/manage', id]);
}

}
