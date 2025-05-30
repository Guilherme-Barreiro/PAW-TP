import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-restaurant-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurant-manage.component.html',
  styleUrls: ['./restaurant-manage.component.css']
})
export class RestaurantManageComponent implements OnInit {
  
success = '';
error = '';
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
    private router: Router,
    private route: ActivatedRoute
    
  ) {}

  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.editMode = true;
    this.editingId = id;
    this.restaurantService.getRestaurantById(id).subscribe({
      next: (r) => {
        this.form = {
          name: r.name,
          location: r.location,
          tempoEntrega: r.tempoEntrega,
          raioEntrega: r.raioEntrega
        };
      },
      error: () => console.warn('Erro ao carregar restaurante para edição.')
    });
  } else {
    this.loadRestaurants();
  }
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

  // Validação manual
  if (!this.form.name || !this.form.location || !this.form.tempoEntrega || !this.form.raioEntrega) {
    this.error = 'Preenche todos os campos obrigatórios.';
    this.success = '';
    return;
  }

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
        this.success = 'Restaurante atualizado com sucesso!';
        this.error = '';

        // Atualiza os dados no formulário
        this.restaurantService.getRestaurantById(this.editingId!).subscribe({
          next: (r) => {
            this.form = {
              name: r.name,
              location: r.location,
              tempoEntrega: r.tempoEntrega,
              raioEntrega: r.raioEntrega
            };
          }
        });

        this.loadRestaurants();
        setTimeout(() => (this.success = ''), 3000);
      },
      error: () => {
        this.error = 'Erro ao atualizar restaurante.';
        this.success = '';
      }
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

  confirmRemove(id: string): void {
  if (confirm('Tens a certeza que queres remover este restaurante? Esta ação é irreversível.')) {
    this.restaurantService.deleteRestaurant(id).subscribe({
      next: () => {
        this.success = 'Restaurante removido com sucesso.';
        this.error = '';
        this.resetForm();        
        this.loadRestaurants();   
      },
      error: () => {
        this.error = 'Erro ao remover restaurante.';
        this.success = '';
      }
    });
  }
}


  resetForm(): void {
    this.form = { name: '', location: '', tempoEntrega: 15, raioEntrega: 5 };
    this.editMode = false;
    this.editingId = null;
  }
}
