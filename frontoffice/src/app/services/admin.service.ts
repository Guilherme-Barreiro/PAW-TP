import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/restaurants/admin/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
