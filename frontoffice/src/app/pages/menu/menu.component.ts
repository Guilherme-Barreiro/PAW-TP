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

  addToCart(dish: any): void {
    this.cartService.addItem({
      dishId: dish._id,
      name: dish.name,
      price: dish.price?.inteira ?? 0,
      quantity: 1
    });

    console.log(`${dish.name} adicionado ao carrinho.`);
  }

  addDish(dishData: any): void {
    if (this.dishes.length >= 10) {
      alert('❌ Não é possível adicionar mais de 10 pratos ao menu.');
      return;
    }

    this.menuService.addDish(this.restaurantId, dishData).subscribe({
      next: (res) => {
        alert('✅ Prato adicionado com sucesso!');
        this.loadMenu();
      },
      error: (err) => {
        console.error('Erro ao adicionar prato:', err);
        alert(err.error?.error || 'Erro ao adicionar prato.');
      }
    });
  }
}
