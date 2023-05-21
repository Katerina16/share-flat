import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'sf-lk-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './lk-layout.component.html'
})
export class LkLayoutComponent {
  readonly menuItems = [
    {
      name: 'Профиль',
      routerLink: '/lk'
    },
    {
      name: 'Мои квартиры',
      routerLink: '/lk/flats'
    },
    {
      name: 'Бронирования моих квартир',
      routerLink: '/lk/reservations'
    }
  ];
}
