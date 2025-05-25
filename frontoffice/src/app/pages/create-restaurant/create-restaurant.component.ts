import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-create-restaurant',
  templateUrl: './create-restaurant.component.html',
  styleUrls: ['./create-restaurant.component.css'],
  imports: [CommonModule, FormsModule]
})
export class CreateRestaurantComponent {
  form = {
    name: '',
    location: '',
    tempoEntrega: 20,
    raioEntrega: 5
  };

  selectedImage: File | null = null;
  error = '';
  success = '';

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {}

  onFileSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  validate(): boolean {
    if (!this.form.name.trim() || !this.form.location.trim()) {
      this.error = 'Todos os campos são obrigatórios.';
      return false;
    }
    if (!this.selectedImage) {
      this.error = 'Seleciona uma imagem para o restaurante.';
      return false;
    }
    return true;
  }

  submit(): void {
    this.error = '';
    this.success = '';

    if (!this.validate()) return;

    const ownerId = this.auth.getUserId();
    if (!ownerId) {
      this.error = 'Autenticação necessária.';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('location', this.form.location);
    formData.append('tempoEntrega', this.form.tempoEntrega.toString());
    formData.append('raioEntrega', this.form.raioEntrega.toString());
    formData.append('createdBy', ownerId);
    formData.append('image', this.selectedImage!);

    this.http.post('http://localhost:3000/api/restaurants', formData).subscribe({
      next: () => {
        this.success = 'Restaurante criado com sucesso. Aguarda validação.';
        setTimeout(() => this.router.navigate(['/home']), 2000);
      },
      error: () => {
        this.error = 'Erro ao criar restaurante.';
      }
    });
  }
}
