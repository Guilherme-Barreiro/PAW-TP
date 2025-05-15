import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  restaurants: any[] = [];
  filteredRestaurants: any[] = [];

  pratosPorRestaurante: { [key: string]: any[] } = {};
  expandedRestaurantes: { [key: string]: boolean } = {};

  imageBaseUrl = 'http://localhost:3000/images/restaurantes/';
  dishImageBaseUrl = 'http://localhost:3000/images/pratos/';

  searchName: string = '';
  searchLocation: string = '';

  constructor(
    private restaurantService: RestaurantService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (res) => {
        this.restaurants = res;
        this.filteredRestaurants = res;
        res.forEach(r => this.loadPratos(r._id));
      },
      error: (err) => console.error('Erro ao carregar restaurantes:', err)
    });
  }

  loadPratos(restaurantId: string): void {
    this.menuService.getMenu(restaurantId).subscribe({
      next: (pratos) => {
        this.pratosPorRestaurante[restaurantId] = pratos;
      },
      error: (err) => {
        console.warn(`Erro ao carregar pratos do restaurante ${restaurantId}:`, err);
        this.pratosPorRestaurante[restaurantId] = [];
      }
    });
  }

  applyFilters(): void {
    this.filteredRestaurants = this.restaurants.filter(r =>
      (this.searchName ? r.name?.toLowerCase().includes(this.searchName.toLowerCase()) : true) &&
      (this.searchLocation ? r.location?.toLowerCase().includes(this.searchLocation.toLowerCase()) : true)
    );
  }

  togglePratos(restaurantId: string): void {
    this.expandedRestaurantes[restaurantId] = !this.expandedRestaurantes[restaurantId];
  }
}
