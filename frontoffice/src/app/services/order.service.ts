// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(
    employeeId: string,
    restaurantId: string,
    items: { dish: string; quantity: number }[],
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
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const payload = { status };

    return this.http.patch(`${this.apiUrl}/${orderId}/status`, payload, { headers });
  }
}

