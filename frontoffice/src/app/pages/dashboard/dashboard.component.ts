import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any = {};
  restaurantes: any[] = [];

  constructor(private auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/api/auth/profile').subscribe({
      next: (res) => {
        this.user = res.user;
        this.restaurantes = res.restaurantes || [];
      },
      error: () => {
        this.user = {};
        this.restaurantes = [];
      }
    });
  }
}
