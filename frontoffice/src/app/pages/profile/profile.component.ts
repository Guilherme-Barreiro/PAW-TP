import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  form = {
    nomeCompleto: '',
    email: '',
    morada: '',
    telefone: '',
    nif: '',
    dataNascimento: ''
  };

  orders: any[] = [];
  message = '';
  error = '';
  loadingOrders = true;

constructor(private http: HttpClient, private router: Router) {}



  ngOnInit(): void {
    // Carregar perfil
    this.http.get<any>('http://localhost:3000/api/auth/profile').subscribe({
      next: (res) => {
        const user = res.user;
        this.form = {
          nomeCompleto: user.nomeCompleto,
          email: user.email,
          morada: user.morada,
          telefone: user.telefone,
          nif: user.nif,
          dataNascimento: user.dataNascimento?.split('T')[0] || ''
        };

        // Carregar histórico de encomendas
        this.http.get<any[]>(`http://localhost:3000/api/orders?userId=${user._id}`).subscribe({
          next: (orders) => {
            this.orders = orders;
            this.loadingOrders = false;
          },
          error: () => {
            this.loadingOrders = false;
            console.error('Erro ao carregar encomendas.');
          }
        });
      },
      error: () => {
        this.error = 'Erro ao carregar perfil.';
      }
    });
  }

  voltar(): void {
  this.router.navigate(['/home']);
}


  updateProfile(): void {
    this.error = '';
    this.message = '';

    this.http.put('http://localhost:3000/api/auth/profile', this.form).subscribe({
      next: (res: any) => {
        this.message = res.message;
      },
      error: (err) => {
        this.error = err.error?.error || 'Erro ao atualizar perfil.';
      }
    });
  }
}
