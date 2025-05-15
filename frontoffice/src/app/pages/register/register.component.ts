import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: any = {
    username: '',
    password: '',
    nomeCompleto: '',
    email: '',
    morada: '',
    telefone: '',
    nif: '',
    dataNascimento: ''
  };

  error = '';
  success = '';

  constructor(private http: HttpClient, private router: Router) {}

  validate(): boolean {
    const { username, nomeCompleto, telefone, nif, morada, dataNascimento } = this.form;
    const dataAtual = new Date().toISOString().split('T')[0];

    if (!/^[A-Za-z]+$/.test(username)) {
      this.error = 'O nome de utilizador só pode conter letras.';
      return false;
    }

    if (/[^A-Za-zÀ-ÿ\s]/.test(nomeCompleto)) {
      this.error = 'O nome completo não pode conter números ou caracteres especiais.';
      return false;
    }

    if (!/^\d{9}$/.test(telefone)) {
      this.error = 'O telefone deve ter exatamente 9 dígitos.';
      return false;
    }

    if (!/^\d{9}$/.test(nif)) {
      this.error = 'O NIF deve ter exatamente 9 dígitos.';
      return false;
    }

    if (!/[A-Za-z]/.test(morada)) {
      this.error = 'A morada deve conter pelo menos uma letra.';
      return false;
    }

    if (dataNascimento > dataAtual) {
      this.error = 'A data de nascimento não pode ser no futuro.';
      return false;
    }

    return true;
  }

  register(): void {
    this.error = '';
    this.success = '';

    if (!this.validate()) return;

    this.http.post('http://localhost:3000/api/auth/register', this.form).subscribe({
      next: () => {
        this.success = 'Conta criada com sucesso!';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        console.error('Erro no registo:', err);
        this.error = err.error?.error || 'Erro ao criar conta.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
