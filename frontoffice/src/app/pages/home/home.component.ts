import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  restaurants: any[] = [];
  hasPending = false;
  username: string | null = null;

  constructor(
    private auth: AuthService,
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.auth.getUserId();
    if (!userId) return;

    this.username = this.auth.getUser()?.nomeCompleto || null;

    this.restaurantService.getRestaurantsByOwner(userId).subscribe({
      next: (res) => {
        this.restaurants = res;
        this.hasPending = res.some(r => r.status === 'pendente');
      },
      error: () => {
        this.restaurants = [];
      }
    });
  }

  irParaCriar(): void {
    this.router.navigate(['/restaurant-create']);
  }


}
