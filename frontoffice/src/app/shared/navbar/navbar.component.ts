import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: any = null;
  isLoggedIn: boolean = false;
  private authSub!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.user = this.authService.getUser();

    this.authSub = this.authService.authStatus$.subscribe(status => {
      this.isLoggedIn = status;
      this.user = status ? this.authService.getUser() : null;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
