import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  dishes: any[] = [];

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

      const restaurantId = restaurants[0]._id; // ✅ assume o primeiro restaurante do dono
      this.menuService.getMenu(restaurantId).subscribe({
        next: (menu) => {
          this.dishes = menu;
        },
        error: (err) => {
          console.error('Erro ao carregar menu:', err);
        }
      });
    },
    error: (err) => {
      console.error('Erro ao buscar restaurantes do utilizador:', err);
    }
  });
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
}
