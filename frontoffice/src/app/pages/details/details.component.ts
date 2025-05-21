import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class DetailsComponent implements OnInit {
  dishId: string = '';
  dish: any = null;
  cartItemCount: number = 0;
  cartTotal: number = 0;
  selectedDose: 'meia' | 'inteira' = 'inteira';

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.dishId = this.route.snapshot.paramMap.get('id') || '';
    this.menuService.getDishById(this.dishId).subscribe({
      next: (res) => this.dish = res,
      error: (err) => console.error('Erro ao carregar prato:', err)
    });

    this.cartItemCount = this.cartService.getTotalItems();
    this.cartTotal = this.cartService.getTotal();

    this.cartService.cart$.subscribe(() => {
      this.cartItemCount = this.cartService.getTotalItems();
      this.cartTotal = this.cartService.getTotal();
    });
  }

  addToCart(): void {
    if (!this.dish) return;
    const precoSelecionado = this.selectedDose === 'meia'
      ? this.dish.price?.meia ?? 0
      : this.dish.price?.inteira ?? 0;

    this.cartService.addItem({
      dishId: this.dish._id,
      name: `${this.dish.name} (${this.selectedDose})`,
      price: precoSelecionado,
      quantity: 1
    });

    alert(`${this.dish.name} (${this.selectedDose}) adicionado ao carrinho.`);
  }
}
