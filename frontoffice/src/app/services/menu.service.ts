import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:3000/api/restaurant/menu'; // ou o caminho completo se for outro

  constructor(private http: HttpClient) {}

  uploadDishImage(restaurantId: string, index: number, image: File): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  const formData = new FormData();
  formData.append('image', image);

  return this.http.post(
    `http://localhost:3000/api/restaurants/${restaurantId}/menu/${index}/image`,
    formData,
    { headers }
  );
}

  getDishById(dishId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  return this.http.get<any>(`http://localhost:3000/api/dishes/${dishId}`, { headers });
  }

  addDish(restaurantId: string, formData: FormData): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  return this.http.post<any>(`http://localhost:3000/api/restaurants/${restaurantId}/menu`,formData, { headers });
}

removeDish(restaurantId: string, index: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  return this.http.delete(`http://localhost:3000/api/restaurants/${restaurantId}/menu/${index}`, { headers });
}

updateDish(restaurantId: string, index: number, dish: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  });

  return this.http.put(
    `http://localhost:3000/api/restaurants/${restaurantId}/menu/${index}`,
    dish,
    { headers }
  );
}

getMenu(restaurantId: string): Observable<any[]> {
  let headers = new HttpHeaders();

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  }

  return this.http.get<any[]>(`http://localhost:3000/api/restaurants/${restaurantId}/menu`, { headers });
}

}
