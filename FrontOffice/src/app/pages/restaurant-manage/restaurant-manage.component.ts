import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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

    constructor(private http: HttpClient, private auth: AuthService) { }

    ngOnInit(): void {
        this.loadRestaurants();
    }

    loadRestaurants(): void {
        const ownerId = this.auth.getUserId();
        this.http.get<any[]>(`http://localhost:3000/api/restaurants/owner/${ownerId}`).subscribe({
            next: (res) => this.restaurants = res,
            error: () => console.warn('Erro ao carregar restaurantes')
        });
    }

    submit(): void {
        const url = this.editingId
            ? `http://localhost:3000/api/restaurants/${this.editingId}`
            : 'http://localhost:3000/api/restaurants';

        const method = this.editingId ? 'put' : 'post';
        const body = {
            ...this.form,
            createdBy: this.auth.getUserId(), // necessário se o backend não associar automaticamente
            status: 'pendente'
        };

        this.http[method](url, body).subscribe({
            next: () => {
                this.resetForm();
                this.loadRestaurants();
            },
            error: () => alert('Erro ao submeter restaurante')
        });
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

        this.http.delete(`http://localhost:3000/api/restaurants/${id}`).subscribe({
            next: () => this.loadRestaurants(),
            error: () => alert('Erro ao apagar restaurante')
        });
    }

    resetForm(): void {
        this.form = { name: '', location: '' };
        this.editMode = false;
        this.editingId = null;
    }
}
