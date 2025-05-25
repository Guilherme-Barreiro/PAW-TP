import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.cartService.cart$.subscribe(() => this.loadCart());
  }

  loadCart(): void {
    this.cartItems = this.cartService.getItems();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  removeItem(id: string, tipo: 'meia' | 'inteira'): void {
    this.cartService.removeItem(id, tipo);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  updateQuantity(item: CartItem): void {
    if (item.quantity < 1) item.quantity = 1;
    this.cartService.updateItem(item.dishId, item.quantity, item.tipo);
  }

  increaseQuantity(item: CartItem): void {
    item.quantity += 1;
    this.cartService.updateItem(item.dishId, item.quantity, item.tipo);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.cartService.updateItem(item.dishId, item.quantity, item.tipo);
    }
  }

  placeOrder(): void {
  const employeeId = this.authService.getUserId();
  if (!employeeId || this.cartItems.length === 0) return;

  const restaurantId = this.cartItems[0].restaurantId;
  if (!restaurantId) {
    alert('Restaurante desconhecido para este pedido.');
    return;
  }

  const items = this.cartItems.map(item => ({
    dish: item.dishId,
    quantity: item.quantity,
    tipo: item.tipo // ✅ ESSENCIAL para distinguir meia/inteira
  }));

  const total = this.getTotal();

  this.orderService.createOrder(employeeId, restaurantId, items, total).subscribe({
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
