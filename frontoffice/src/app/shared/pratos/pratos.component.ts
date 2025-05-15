import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prato',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prato.component.html',
  styleUrls: ['./prato.component.css']
})
export class PratoComponent {
  @Input() prato: any;
  imageBaseUrl = 'http://localhost:3000/images/pratos/';
}
