import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-redirect',
  template: '',
})
export class RedirectComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const isAuth = this.authService.isAuthenticated();
    const role = this.authService.getUserRole();

    if (!isAuth) {
      this.router.navigate(['/landing']);
      return;
    }

    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
