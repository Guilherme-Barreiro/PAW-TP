import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';

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
  expandedRestauranteId: string | null = null;

  imageBaseUrl = 'http://localhost:3000/images/restaurantes/';
  dishImageBaseUrl = 'http://localhost:3000/images/pratos/';

  searchName: string = '';
  searchLocation: string = '';
  role: string | null = null;

  constructor(
    private restaurantService: RestaurantService,
    private menuService: MenuService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  // Método que carrega os restaurantes públicos validados e aplica filtro inicial
  loadRestaurants(): void {
    this.restaurantService.getPublicRestaurants().subscribe({
      next: (res) => {
        this.restaurants = res;
        this.applyFilters(); // garante que filteredRestaurants não fica vazio inicialmente
      },
      error: (err) => console.error("Erro ao buscar restaurantes:", err)
    });
  }

  // Aplica filtro local nos restaurantes já carregados
  applyFilters(): void {
    const normalize = (str: string) =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    this.filteredRestaurants = this.restaurants.filter(r =>
      (!this.searchName || normalize(r.name || '').includes(normalize(this.searchName))) &&
      (!this.searchLocation || normalize(r.location || '').includes(normalize(this.searchLocation)))
    );
  }

  // Alterna a expansão dos pratos, carregando-os ao expandir
  togglePratosExclusivo(restaurantId: string): void {
    this.expandedRestauranteId = this.expandedRestauranteId === restaurantId ? null : restaurantId;

    if (this.expandedRestauranteId) {
      this.loadPratos(restaurantId);
    }
  }

  // Carrega pratos do restaurante especificado
  loadPratos(restaurantId: string): void {
    this.menuService.getMenu(restaurantId).subscribe({
      next: (pratos: any[]) => {
        this.pratosPorRestaurante[restaurantId] = pratos;
      },
      error: (err) => {
        console.warn(`Erro ao carregar pratos do restaurante ${restaurantId}:`, err);
        this.pratosPorRestaurante[restaurantId] = [];
      }
    });
  }

  // Verifica se existem pratos válidos para mostrar
  isPratosValidos(id: string): boolean {
    return Array.isArray(this.pratosPorRestaurante[id]) && this.pratosPorRestaurante[id].length > 0;
  }
}
