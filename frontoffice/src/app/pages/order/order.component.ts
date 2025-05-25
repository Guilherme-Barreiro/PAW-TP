import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  imports: [CommonModule]
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  error = '';
  loading = true;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    const ownerId = this.auth.getUserId();

    this.http.get<any[]>(`http://localhost:3000/api/restaurants/owner/${ownerId}`).subscribe({
      next: (res) => {
        if (res.length === 0) {
          this.error = 'Ainda não tens restaurante registado.';
          this.loading = false;
          return;
        }

        const restaurant = res[0];

        // ❗ Só mostrar se estiver validado
        if (restaurant.status !== 'validado') {
          this.error = `O teu restaurante está com o estado: ${restaurant.status}. Só poderás ver pedidos quando for validado.`;
          this.loading = false;
          return;
        }

        this.http.get<any[]>(`http://localhost:3000/api/orders/byRestaurant/${restaurant._id}`).subscribe({
          next: (orders) => {
            this.orders = orders;
            this.loading = false;
          },
          error: () => {
            this.error = 'Erro ao carregar pedidos.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Erro ao obter restaurante.';
        this.loading = false;
      }
    });
  }
}
