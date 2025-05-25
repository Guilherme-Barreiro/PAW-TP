import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  uploadDishImage(restaurantId: string, index: number, image: File): Observable<any> {
    const headers = this.getAuthHeaders();
    const formData = new FormData();
    formData.append('image', image);

    return this.http.post(
      `http://localhost:3000/api/restaurants/${restaurantId}/menu/${index}/image`,
      formData,
      { headers }
    );
  }

  getDishById(dishId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(
      `http://localhost:3000/api/dishes/${dishId}`,
      { headers }
    );
  }

  addDish(restaurantId: string, formData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(
      `http://localhost:3000/api/restaurants/${restaurantId}/menu`,
      formData,
      { headers }
    );
  }

  removeDish(restaurantId: string, index: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(
      `http://localhost:3000/api/restaurants/${restaurantId}/menu/${index}`,
      { headers }
    );
  }

  updateDish(restaurantId: string, index: number, dish: any): Observable<any> {
    // Mantém o 'Content-Type' em JSON para PUT
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.put(
      `http://localhost:3000/api/restaurants/${restaurantId}/menu/${index}`,
      dish,
      { headers }
    );
  }

  getMenu(restaurantId: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(
      `http://localhost:3000/api/restaurants/${restaurantId}/menu`,
      { headers }
    );
  }
}
