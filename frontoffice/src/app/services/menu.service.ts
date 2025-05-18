import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:3000/api/restaurant/menu'; // ou o caminho completo se for outro

  constructor(private http: HttpClient) {}

  getDishById(dishId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  return this.http.get<any>(`http://localhost:3000/api/dishes/${dishId}`, { headers });
  }

  addDish(restaurantId: string, dish: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  return this.http.post<any>(`http://localhost:3000/api/restaurants/${restaurantId}/menu`, dish, { headers });
}

  getMenu(restaurantId: string): Observable<any[]> {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  

  

  return this.http.get<any[]>(`http://localhost:3000/api/restaurants/${restaurantId}/menu`, { headers });
}

}
