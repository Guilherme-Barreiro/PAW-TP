import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantComponent } from '../../shared/restaurant/restaurant.component';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RestaurantComponent],
  template: `
    <div class="text-center mt-4">
      <h2 class="text-success">🍽️ Restaurantes Disponíveis</h2>
    </div>
    <app-restaurant></app-restaurant>
  `
})
export class HomeComponent {}
