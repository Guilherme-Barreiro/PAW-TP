import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; // <-- IMPORTA O ROUTER

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private apiUrl = 'http://localhost:3000/api/auth';

constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/auth/login', {
      username,
      password
    });
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

logout(): void {
  const username = this.getUser()?.nomeCompleto || 'Utilizador';
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.router.navigate(['/logout'], { state: { username } });
}

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp > now;
    } catch {
      return false;
    }
  }

  isLoggedIn(): boolean {
    const decoded = this.decodeToken();
    if (!decoded || !decoded.exp) return false;

    const now = Date.now().valueOf() / 1000;
    return decoded.exp > now;
  }

  getUserId(): string | null {
    const decoded = this.decodeToken();
    return decoded?.id || null;
  }

  getUserRole(): string | null {
    const decoded = this.decodeToken();
    return decoded?.role || null;
  }

  private decodeToken(): any {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  getUser(): any {
    return this.decodeToken();
  }
}
