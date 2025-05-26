import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-status',
  standalone: true,
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css'],
  imports: [CommonModule, FormsModule]
})
export class OrderStatusComponent implements OnInit {
  @Input() orderId!: string;
  @Input() currentStatus!: string;

  selectedStatus: string = 'pending';
  statuses = ['pending', 'preparing', 'shipped', 'delivered'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.selectedStatus = this.currentStatus || 'pending';
  }

  changeStatus(): void {
    if (!this.orderId || this.selectedStatus === this.currentStatus) return;

    this.orderService.updateOrderStatus(this.orderId, this.selectedStatus).subscribe({
      next: () => {
        this.currentStatus = this.selectedStatus;
        alert('Estado atualizado com sucesso!');
      },
      error: () => {
        alert('Erro ao atualizar estado.');
      }
    });
  }

  traduzirStatus(status: string): string {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'A preparar';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      default: return status;
    }
  }
}
