import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

export interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  tipo: 'meia' | 'inteira';
  restaurantId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private userId: string | null = null;

  cart$ = this.cartSubject.asObservable();

  constructor(private auth: AuthService) {
    this.userId = this.auth.getUserId();

    if (typeof window !== 'undefined' && this.userId) {
      const saved = localStorage.getItem(`cart_${this.userId}`);
      if (saved) {
        this.cartItems = JSON.parse(saved);
        this.cartSubject.next(this.cartItems);
      }
    }
  }

  private updateCart() {
    if (this.userId) {
      localStorage.setItem(`cart_${this.userId}`, JSON.stringify(this.cartItems));
      this.cartSubject.next(this.cartItems);
    }
  }

  getStartTime(): number | null {
  const userId = this.auth.getUserId();
  if (!userId) return null;
  const time = localStorage.getItem(`cart_start_${userId}`);
  return time ? +time : null;
}


  addItem(item: CartItem) {
  if (
    this.cartItems.length > 0 &&
    this.cartItems[0].restaurantId !== item.restaurantId
  ) {
    if (!confirm('O carrinho já contém pratos de outro restaurante. Desejas limpar o carrinho para adicionar este novo prato?')) {
      return;
    }
    this.clearCart();
  }

  const index = this.cartItems.findIndex(
    i => i.dishId === item.dishId && i.tipo === item.tipo
  );
  if (index > -1) {
    this.cartItems[index].quantity += item.quantity;
  } else {
    this.cartItems.push(item);
  }

  if (this.userId) {
    localStorage.setItem(`cart_start_${this.userId}`, Date.now().toString());
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
  if (this.userId) {
    localStorage.removeItem(`cart_${this.userId}`);
    localStorage.removeItem(`cart_start_${this.userId}`);
  }
  this.cartSubject.next(this.cartItems);
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
