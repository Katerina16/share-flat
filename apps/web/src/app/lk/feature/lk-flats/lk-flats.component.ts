import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';
import { FlatIslandComponent } from '../../../shared/flat-island/flat-island.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sf-lk-flats',
  standalone: true,
  imports: [CommonModule, FlatIslandComponent, RouterLink],
  templateUrl: './lk-flats.component.html'
})
export class LkFlatsComponent {
  flats$ = this.http.get<FlatEntity[]>('/flat/my');

  constructor(private readonly http: HttpClient) {}
}
