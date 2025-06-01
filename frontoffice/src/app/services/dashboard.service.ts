import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api/restaurants/admin/dashboard';

  constructor(private http: HttpClient) {}

getStats() {
  return this.http.get<any>(this.apiUrl);
}

}
