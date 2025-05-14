import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service'; 

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  restaurantId: string = ''; 

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private restaurantService: RestaurantService, // ✅ INJETADO
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.restaurantService.getRestaurantsByOwner(userId).subscribe({
      next: (restaurants: any[]) => {
        if (restaurants.length > 0) {
          this.restaurantId = restaurants[0]._id;
        } else {
          console.warn('Nenhum restaurante encontrado para este utilizador.');
        }
      },
      error: (err: any) => {
        console.error('Erro ao buscar restaurantes:', err);
      }
    });

    this.loadCart();
    this.cartService.cart$.subscribe(() => this.loadCart());
  }

  loadCart(): void {
    this.cartItems = this.cartService.getItems();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  removeItem(id: string): void {
    this.cartService.removeItem(id);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

placeOrder(): void {
  const employeeId = this.authService.getUserId();

  if (!employeeId || !this.restaurantId) {
    console.error('Faltam dados para submeter o pedido.');
    return;
  }

  const items = this.cartItems.map(item => ({
    dish: item.dishId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity
  }));

  const total = this.getTotal();

  this.orderService.createOrder(employeeId, this.restaurantId, items, total).subscribe({
    next: () => {
      alert('Pedido enviado com sucesso!');
      this.cartService.clearCart();
      this.router.navigate(['/']);
    },
    error: err => {
      console.error('Erro ao enviar pedido:', err);
      alert('Erro ao enviar pedido.');
    }
  });
}

}
