import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontoffice';
  showLayout = true;

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      const currentRoute = (event as NavigationEnd).urlAfterRedirects;
      this.showLayout = !['/login', '/register'].includes(currentRoute);
    });
  }
}
