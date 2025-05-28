// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient, private auth: AuthService) {}

  createOrder(
  employeeId: string,
  restaurantId: string,
  items: {
    dish: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    tipo: 'meia' | 'inteira';
  }[],
  total: number
): Observable<any> {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  });

  const orderPayload = {
    employee: employeeId,
    restaurant: restaurantId,
    items,
    total
  };

  return this.http.post(this.apiUrl, orderPayload, { headers });
}
 updateOrderStatus(orderId: string, newStatus: string): Observable<any> {
  const token = this.auth.getUser()?.token || localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.patch(`${this.apiUrl}/${orderId}/status`, { status: newStatus }, { headers });
}

  
}

