import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-add-dish',
  templateUrl: './menuAddDish.component.html',
  styleUrls: ['./menuAddDish.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MenuAddDishComponent implements OnInit {
  restaurantId: string = '';
  categories = ['Carne', 'Peixe', 'Vegetariano', 'Sobremesa'];
  menuLength: number = 0;

  novoPrato: any = {
    name: '',
    category: 'Carne',
    description: '',
    tempoPreparacao: 15,
    price: { meia: 0, inteira: 0 },
    nutrition: ''
  };

  selectedImage: File | null = null;
  error = '';
  success = '';

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.restaurantId = params['restaurantId'];
      if (!this.restaurantId) {
        this.error = 'ID do restaurante não foi fornecido.';
        return;
      }
      this.loadMenuLength();
    });
  }

  loadMenuLength(): void {
    this.menuService.getMenu(this.restaurantId).subscribe({
      next: (menu) => this.menuLength = menu.length,
      error: () => this.error = 'Erro ao verificar o menu.'
    });
  }

  onFileSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  validate(): boolean {
    const { name, price } = this.novoPrato;
    if (!name || name.trim().length < 2) {
      this.error = 'O nome do prato deve ter pelo menos 2 caracteres.';
      return false;
    }
    if (price.meia < 0 || price.inteira < 0) {
      this.error = 'Preços devem ser positivos.';
      return false;
    }
    if (!this.selectedImage) {
      this.error = 'Deve selecionar uma imagem.';
      return false;
    }
    if (this.menuLength >= 10) {
      this.error = 'Este restaurante já tem 10 pratos.';
      return false;
    }
    return true;
  }

  submit(): void {
    this.error = '';
    this.success = '';

    if (!this.validate()) return;

    const formData = new FormData();
    for (const key in this.novoPrato) {
      if (key !== 'price') {
        formData.append(key, this.novoPrato[key]);
      }
    }

    formData.append('price_meia', this.novoPrato.price.meia);
    formData.append('price_inteira', this.novoPrato.price.inteira);
    formData.append('image', this.selectedImage!);

    this.menuService.addDish(this.restaurantId, formData).subscribe({
      next: () => {
        this.success = '✅ Prato criado com sucesso!';
        setTimeout(() => this.router.navigate(['/menu']), 1500);
      },
      error: () => this.error = 'Erro ao adicionar prato.'
    });
  }
}
