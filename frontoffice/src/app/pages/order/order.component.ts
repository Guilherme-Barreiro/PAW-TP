import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { forkJoin } from 'rxjs';
import { OrderStatusComponent } from '../order-status/order-status.component';

@Component({
  standalone: true,
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  imports: [CommonModule, OrderStatusComponent]
})
export class OrderComponent implements OnInit {
  groupedOrders: { restaurante: string, pedidos: any[] }[] = [];
  error = '';
  loading = true;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    const ownerId = this.auth.getUserId();
    if (!ownerId) {
      this.error = 'Utilizador não autenticado.';
      this.loading = false;
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/api/restaurants/owner/${ownerId}`).subscribe({
      next: (restaurants) => {
        const validados = restaurants.filter(r => r.status === 'validado');
        if (validados.length === 0) {
          this.error = 'Ainda não tens restaurante validado.';
          this.loading = false;
          return;
        }

        const pedidosObservables = validados.map(r =>
          this.http.get<any[]>(`http://localhost:3000/api/orders/byRestaurant/${r._id}`)
        );

        forkJoin(pedidosObservables).subscribe({
          next: (resultArrays) => {
            const allOrders = resultArrays.flat();

            const agrupado: { [nomeRestaurante: string]: any[] } = {};
            allOrders.forEach(order => {
              const nome = order.restaurant?.name || 'Sem Nome';
              if (!agrupado[nome]) agrupado[nome] = [];
              agrupado[nome].push(order);
            });

            this.groupedOrders = Object.entries(agrupado).map(([restaurante, pedidos]) => ({
              restaurante,
              pedidos
            }));

            this.loading = false;
          },
          error: () => {
            this.error = 'Erro ao carregar pedidos.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Erro ao obter restaurantes.';
        this.loading = false;
      }
    });
  }

  traduzirEstado(status: string): string {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'A preparar';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  }
}
