import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  stripePromise = loadStripe('process.env.STRIPE_PUBLIC_KEY');

  constructor(private http: HttpClient, private auth: AuthService) {}

  async checkout(items: any[]) {
    const stripe = await this.stripePromise;
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Token JWT não encontrado. Faz login primeiro.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post<{ url: string }>('http://localhost:3000/api/orders/pay', {
      items,
      successUrl: 'http://localhost:4200/order?success=true',
      cancelUrl: 'http://localhost:4200/order?canceled=true'
    }, { headers }).subscribe({
      next: (res) => {
        if (res.url) {
          window.location.href = res.url;
        } else {
          alert('Erro: URL de pagamento não recebida.');
        }
      },
      error: (err) => {
        console.error('❌ Erro ao criar sessão Stripe:', err);
        alert('Erro ao criar sessão de pagamento.');
      }
    });
  }
}
