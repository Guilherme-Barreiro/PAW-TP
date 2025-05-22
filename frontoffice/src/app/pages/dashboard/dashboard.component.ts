import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ⬅ necessário
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // ⬅ obrigatório para usar *ngIf
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  stats: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getStats().subscribe({
      next: (res: any) => this.stats = res,
      error: (err: any) => console.error('Erro ao carregar estatísticas:', err)
    });
  }
}
