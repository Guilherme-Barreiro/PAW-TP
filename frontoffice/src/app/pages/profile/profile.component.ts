import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  message = '';
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
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
      },
      error: () => {
        this.error = 'Erro ao carregar perfil.';
      }
    });
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
