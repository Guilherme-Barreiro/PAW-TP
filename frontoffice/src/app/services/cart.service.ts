import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  tipo: 'meia' | 'inteira'; // NOVO
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cartSubject.asObservable();

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cart');
      if (saved) {
        this.cartItems = JSON.parse(saved);
        this.cartSubject.next(this.cartItems);
      }
    }
  }

  private updateCart() {
    this.cartSubject.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  addItem(item: CartItem) {
    const index = this.cartItems.findIndex(
      i => i.dishId === item.dishId && i.tipo === item.tipo
    );
    if (index > -1) {
      this.cartItems[index].quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }
    this.updateCart();
  }

  updateItem(dishId: string, quantity: number, tipo: 'meia' | 'inteira'): void {
    const index = this.cartItems.findIndex(i => i.dishId === dishId && i.tipo === tipo);
    if (index > -1) {
      this.cartItems[index].quantity = quantity;
      this.updateCart();
    }
  }

  removeItem(dishId: string, tipo: 'meia' | 'inteira') {
    this.cartItems = this.cartItems.filter(i => !(i.dishId === dishId && i.tipo === tipo));
    this.updateCart();
  }

  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  getItems(): CartItem[] {
    return [...this.cartItems];
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}
