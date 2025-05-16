import { Component, Input, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-status',
  template: `
    <div>
      <p><strong>Current status:</strong> {{ status }}</p>
      <select [(ngModel)]="selectedStatus">
        <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
      </select>
      <button (click)="changeStatus()">Update Status</button>
    </div>
  `
})
export class OrderStatusComponent implements OnInit {
  @Input() orderId!: string;
  status: string = 'pending';
  selectedStatus: string = 'pending';
  statuses = ['pending', 'preparing', 'shipped', 'delivered'];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    // Opcional: carregar status atual via API aqui se quiseres
  }

  changeStatus() {
    this.orderService.updateOrderStatus(this.orderId, this.selectedStatus).subscribe({
      next: () => {
        this.status = this.selectedStatus;
        alert('Order status updated successfully!');
      },
      error: () => {
        alert('Failed to update order status.');
      }
    });
  }
}
