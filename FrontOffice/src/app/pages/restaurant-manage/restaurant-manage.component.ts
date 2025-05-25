import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-restaurant-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurant-manage.component.html',
  styleUrls: ['./restaurant-manage.component.css']
})
export class RestaurantManageComponent implements OnInit {
  restaurants: any[] = [];
  form: any = {
    name: '',
    location: '',
    tempoEntrega: 15,
    raioEntrega: 5
  };
  editMode = false;
  editingId: string | null = null;
  selectedImage: File | null = null;

  constructor(
    private restaurantService: RestaurantService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    const ownerId = this.auth.getUserId();
    if (!ownerId) return;

    this.restaurantService.getRestaurantsByOwner(ownerId).subscribe({
      next: (res) => this.restaurants = res,
      error: () => console.warn('Erro ao carregar restaurantes')
    });
  }

  submit(): void {
  const ownerId = this.auth.getUserId();
  if (!ownerId) return;

  if (this.editMode && this.editingId) {
    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('location', this.form.location);
    formData.append('tempoEntrega', this.form.tempoEntrega.toString());
    formData.append('raioEntrega', this.form.raioEntrega.toString());
    formData.append('createdBy', ownerId);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.restaurantService.updateRestaurantWithImage(this.editingId, formData).subscribe({
      next: () => {
        this.resetForm();
        this.loadRestaurants();
      },
      error: () => alert('Erro ao atualizar restaurante')
    });
  }
}

onFileSelected(event: any): void {
  this.selectedImage = event.target.files[0];
}


  edit(restaurant: any): void {
    this.editMode = true;
    this.editingId = restaurant._id;
    this.form = {
      name: restaurant.name,
      location: restaurant.location,
      tempoEntrega: restaurant.tempoEntrega,
      raioEntrega: restaurant.raioEntrega
    };
  }

  remove(id: string): void {
    if (!confirm('Tens a certeza que queres apagar este restaurante?')) return;

    this.restaurantService.deleteRestaurant(id).subscribe({
      next: () => this.loadRestaurants(),
      error: () => alert('Erro ao apagar restaurante')
    });
  }

  voltar(): void {
    this.router.navigate(['/admin']);
  }

  resetForm(): void {
    this.form = { name: '', location: '', tempoEntrega: 15, raioEntrega: 5 };
    this.editMode = false;
    this.editingId = null;
  }
}
