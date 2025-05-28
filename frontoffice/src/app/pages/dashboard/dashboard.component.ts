import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // ⬅ necessário para navegação
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  stats: any = null;

  constructor(
    private adminService: AdminService,
    private router: Router // ⬅ injeção do Router
  ) {}

  ngOnInit(): void {
    this.adminService.getStats().subscribe({
      next: (res: any) => this.stats = res,
      error: (err: any) => console.error('Erro ao carregar estatísticas:', err)
    });
  }

  voltar(): void {
    this.router.navigate(['/admin']);
  }
}
