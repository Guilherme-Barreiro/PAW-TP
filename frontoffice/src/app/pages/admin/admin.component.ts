import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- necessário para *ngIf, *ngFor
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  pendingRestaurants: any[] = [];

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.loadPendingRestaurants();
  }

  loadPendingRestaurants(): void {
    this.restaurantService.getPendingRestaurants().subscribe({
      next: (res) => this.pendingRestaurants = res,
      error: (err) => console.error('Erro ao carregar restaurantes pendentes:', err)
    });
  }

  validate(id: string): void {
    this.restaurantService.validateRestaurant(id).subscribe(() => this.loadPendingRestaurants());
  }

  reject(id: string): void {
    this.restaurantService.rejectRestaurant(id).subscribe(() => this.loadPendingRestaurants());
  }
}
