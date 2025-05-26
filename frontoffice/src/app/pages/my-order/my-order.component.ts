import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css'],
  imports: [CommonModule]
})
export class MyOrderComponent implements OnInit, OnDestroy {
  orders: any[] = [];
  error = '';
  loading = true;
  intervalId: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.http.get<any[]>('http://localhost:3000/api/orders').subscribe({
      next: (res) => {
        this.orders = res.map(order => ({
          ...order,
          tempoRestante: this.calcularTempoRestante(order)
        }));
        this.iniciarContador();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar pedidos:', err);
        this.error = 'Erro ao carregar pedidos.';
        this.loading = false;
      }
    });
  }

  cancelar(id: string): void {
    if (!confirm('Tens a certeza que queres cancelar este pedido?')) return;

    this.http.patch(`http://localhost:3000/api/orders/${id}/cancel`, {}).subscribe({
      next: () => {
        alert('Pedido cancelado com sucesso.');
        this.loadOrders();
      },
      error: () => {
        alert('Erro ao cancelar o pedido.');
      }
    });
  }

  calcularTempoRestante(order: any): string {
    const criado = new Date(order.createdAt).getTime();
    const agora = Date.now();
    const estimado = (order.tempoTotal || 30) * 60 * 1000;
    const restante = Math.max(criado + estimado - agora, 0);

    const min = Math.floor(restante / 60000);
    const seg = Math.floor((restante % 60000) / 1000);

    return `${min}m ${seg}s`;
  }

  iniciarContador(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.orders = this.orders.map(order => ({
        ...order,
        tempoRestante: this.calcularTempoRestante(order)
      }));
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
