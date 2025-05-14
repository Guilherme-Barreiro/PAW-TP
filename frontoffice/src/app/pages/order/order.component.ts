import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  imports: [CommonModule]
})
export class OrderComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
  const employeeId = this.authService.getUserId();
  const restaurantId = '680ceb26b8d3bae0bb7ad0b7'; // ID correto
  const items = this.cartService.getItems().map(item => ({
    dish: item.dishId,
    quantity: item.quantity
  }));
  const total = this.cartService.getTotal();

  if (!employeeId) {
    console.error('Não autenticado.');
    return;
  }

  this.orderService.createOrder(employeeId, restaurantId, items, total).subscribe({
    next: (res) => {
      console.log('✅ Pedido criado:', res);
      this.cartService.clearCart();
      this.router.navigate(['/']);
    },
    error: (err) => {
      console.error('❌ Erro ao criar pedido:', err);
    }
  });
}

}
