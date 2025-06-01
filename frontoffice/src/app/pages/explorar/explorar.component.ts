import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './explorar.component.html',
  styleUrls: ['./explorar.component.css']
})
export class ExplorarComponent implements OnInit {
  restaurants: any[] = [];
  menu: any[] = [];
  selectedRestaurantId = '';

  constructor(
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private menuService: MenuService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router // ✅ Adicionado
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.restaurantService.getPublicRestaurants().subscribe(res => {
      this.restaurants = res.filter(r => r.createdBy !== userId);
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.selectedRestaurantId = id;
      this.menuService.getMenu(id).subscribe({
        next: res => this.menu = res,
        error: () => console.warn('Erro ao carregar menu.')
      });
    }
  }

  verMenu(restaurantId: string): void {
    this.selectedRestaurantId = restaurantId;
    this.menuService.getMenu(restaurantId).subscribe({
      next: res => this.menu = res,
      error: () => console.warn('Erro ao carregar menu.')
    });
  }

  addToCart(dish: any, tipo: 'meia' | 'inteira'): void {
  const existingItems = this.cartService.getItems()
    .filter(item => item.dishId === dish._id);

  const hasMeia = existingItems.some(item => item.tipo === 'meia');

  if (tipo === 'meia' && hasMeia) {
    alert('⚠️ Já adicionaste uma meia dose deste prato.');
    return;
  }

  const price = tipo === 'meia' ? dish.price.meia : dish.price.inteira;

  this.cartService.addItem({
    dishId: dish._id,
    name: dish.name,
    price,
    quantity: 1,
    tipo,
    restaurantId: this.selectedRestaurantId
  });

  alert(`✅ ${dish.name} (${tipo}) adicionado ao carrinho!`);
}

  voltarParaHome(): void {
    this.router.navigate(['/home']);
  }

  isUserLoggedIn(): boolean {
  return this.authService.isAuthenticated();
  }

}
