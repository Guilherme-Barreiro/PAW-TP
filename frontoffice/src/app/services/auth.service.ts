import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  // 🔐 Envia credenciais para o backend
  login(username: string, password: string): Observable<any> {
  return this.http.post<any>('http://localhost:3000/api/auth/login', {
    username,
    password
  });
}

  // ✅ Guarda token localmente
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // ❌ Apaga o token e faz logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
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

  // 🕒 Verifica se o token ainda é válido
  isLoggedIn(): boolean {
    const decoded = this.decodeToken();
    if (!decoded || !decoded.exp) return false;

    const now = Date.now().valueOf() / 1000;
    return decoded.exp > now;
  }

  // 🆔 Extrai ID do utilizador
  getUserId(): string | null {
    const decoded = this.decodeToken();
    return decoded?.id || null;
  }

  // 🎭 Extrai o tipo de utilizador (cliente/admin/etc.)
  getUserRole(): string | null {
    const decoded = this.decodeToken();
    return decoded?.role || null;
  }

  // 📦 Decodifica o token JWT armazenado
  private decodeToken(): any {
  if (typeof window === 'undefined') return null; // ⚠️ ambiente server-side
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

getUser(): any {
  return this.decodeToken(); // Usa a função privada existente
}

}
