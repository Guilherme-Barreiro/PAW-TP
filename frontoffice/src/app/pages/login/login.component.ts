import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
  this.error = '';

  this.authService.login(this.username, this.password).subscribe({
    next: (res) => {
      this.authService.saveToken(res.token);
      const role = res.user?.role;

      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/home']);
      }
    },
    error: (err) => {
      console.error('Login falhou:', err);
      this.error = err.error?.error || 'Credenciais inválidas.';
    }
  });
}


  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
