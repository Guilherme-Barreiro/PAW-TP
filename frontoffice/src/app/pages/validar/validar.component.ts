import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 IMPORTANTE
import { RestaurantService } from '../../services/restaurant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validar',
  standalone: true,
  imports: [CommonModule], // 👈 Adicionado aqui
  templateUrl: './validar.component.html'
})
export class ValidarComponent implements OnInit {
  pendentes: any[] = [];

  constructor(private restaurantService: RestaurantService, private router: Router) {}

  ngOnInit(): void {
    this.carregarPendentes();
  }

  carregarPendentes(): void {
    this.restaurantService.getPendingRestaurants().subscribe({
      next: (res: any[]) => this.pendentes = res,
      error: (err: any) => console.error('Erro ao carregar restaurantes pendentes:', err)
    });
  }

  
voltar(): void {
  this.router.navigate(['/admin']);
}

  aprovar(id: string): void {
    this.restaurantService.validateRestaurant(id).subscribe(() => this.carregarPendentes());
  }

  rejeitar(id: string): void {
    this.restaurantService.rejectRestaurant(id).subscribe(() => this.carregarPendentes());
  }
}
