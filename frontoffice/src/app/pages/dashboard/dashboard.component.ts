import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewChecked {
  stats: any = null;
  chartsInit = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
        console.log('Dados carregados:', this.stats);
      },
      error: (err) => console.error('Erro ao carregar estatísticas:', err)
    });
  }

  ngAfterViewChecked(): void {
    if (this.stats && !this.chartsInit) {
      this.initCharts();
      this.chartsInit = true;
    }
  }

  initCharts(): void {
  if (!this.stats) return;

  const { topUsers, topRestaurants, expensiveRestaurants } = this.stats;

  // 🟦 Gráfico Totais
  const ctxAdmin = document.getElementById('adminChart') as HTMLCanvasElement;
  if (ctxAdmin) {
    new Chart(ctxAdmin, {
      type: 'bar',
      data: {
        labels: ['Utilizadores', 'Restaurantes', 'Pratos'],
        datasets: [{
          label: 'Totais',
          data: [
            this.stats.totalUsers,
            this.stats.totalRestaurants,
            this.stats.totalDishes
          ],
          backgroundColor: ['#0d6efd', '#20c997', '#ffc107']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Totais do Sistema' }
        },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // 🟩 Top Criadores
  const ctxTop = document.getElementById('topCreatorsChart') as HTMLCanvasElement;
  if (ctxTop && topUsers?.length) {
    new Chart(ctxTop, {
      type: 'bar',
      data: {
        labels: topUsers.map((u: any) => u.username),
        datasets: [{
          label: 'Número de Restaurantes Criados',
          data: topUsers.map((u: any) => u.totalRestaurantes),
          backgroundColor: ['#0d6efd', '#ffc107', '#28a745', '#dc3545', '#17a2b8']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Top Criadores de Restaurantes' }
        },
        scales: {
          x: { beginAtZero: true }
        }
      }
    });
  }

  // 🍽 Restaurantes com Mais Pratos
  const ctxDishes = document.getElementById('topRestaurantDishesChart') as HTMLCanvasElement;
  if (ctxDishes && topRestaurants?.length) {
    new Chart(ctxDishes, {
      type: 'doughnut',
      data: {
        labels: topRestaurants.map((r: any) => r.name),
        datasets: [{
          label: 'Número de Pratos',
          data: topRestaurants.map((r: any) => r.totalPratos),
          backgroundColor: ['#ff5733', '#c70039', '#900c3f', '#581845', '#1d3557']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'Restaurantes com Mais Pratos' }
        }
      }
    });
  }

  // 💸 Restaurantes Mais Caros
  const ctxExpensive = document.getElementById('expensiveRestaurantsChart') as HTMLCanvasElement;
  if (ctxExpensive && expensiveRestaurants?.length) {
    new Chart(ctxExpensive, {
      type: 'line',
      data: {
        labels: expensiveRestaurants.map((r: any) => r.name),
        datasets: [{
          label: 'Preço Médio (€)',
          data: expensiveRestaurants.map((r: any) => +r.avgPrice.toFixed(2)),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Restaurantes Mais Caros' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
}
