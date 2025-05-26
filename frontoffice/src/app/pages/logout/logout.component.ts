import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  nome: string = 'Utilizador';

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state && state['username']) {
      this.nome = state['username'];
    }
  }

  voltarManualmente(): void {
    this.router.navigate(['/']);
  }
}
