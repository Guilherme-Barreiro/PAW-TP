import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  user: any = null;
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const userData = this.authService.getUser();
    this.isLoggedIn = this.authService.isAuthenticated();

    if (userData) {
      this.user = userData;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
