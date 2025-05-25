import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validar.component.html',
})
export class ValidarComponent implements OnInit {
  pendentes: any[] = [];

  constructor(
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarPendentes();
  }

  carregarPendentes(): void {
    this.restaurantService.getPendingRestaurants().subscribe({
      next: (res: any[]) => this.pendentes = res,
      error: (err) => console.error('❌ Erro ao carregar pendentes:', err)
    });
  }

  aprovar(id: string): void {
    this.restaurantService.validateRestaurant(id).subscribe({
      next: () => this.carregarPendentes(),
      error: (err) => console.error('❌ Erro ao validar restaurante:', err)
    });
  }

  rejeitar(id: string): void {
  this.restaurantService.rejectRestaurant(id).subscribe({
    next: () => this.carregarPendentes(),
    error: (err) => console.error('❌ Erro ao rejeitar restaurante:', err)
  });
}


  voltar(): void {
    this.router.navigate(['/admin']);
  }
}
