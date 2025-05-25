import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = 'http://localhost:3000/api/restaurants';

  constructor(private http: HttpClient) {}

  // ✅ Buscar restaurantes criados por este utilizador (owner)
  getRestaurantsByOwner(ownerId: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/owner/${ownerId}`, { headers });
  }

  // ✅ Buscar restaurante por ID específico
  getRestaurantById(id: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
}

getPublicRestaurants(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:3000/api/restaurants/public');
}

getPendingRestaurants() {
  return this.http.get<any[]>('http://localhost:3000/api/restaurants/status/pending');
}

validateRestaurant(id: string) {
  return this.http.put(`http://localhost:3000/api/restaurants/${id}/validate`, {});
}

rejectRestaurant(id: string) {
  return this.http.put(`http://localhost:3000/api/restaurants/${id}/reject`, {});
}

updateRestaurant(id: string, data: any) {
  return this.http.put(`${this.apiUrl}/${id}`, data);
}

deleteRestaurant(id: string) {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

createRestaurant(data: any) {
  return this.http.post<any>(this.apiUrl, data);
}

  // ✅ Buscar todos os restaurantes (se necessário)
  getAllRestaurants(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
