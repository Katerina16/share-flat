import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'sf-flat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flat-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatCardComponent implements OnInit {

  flat$: Observable<FlatEntity>;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.flat$ = this.route.params.pipe(
      switchMap(params => this.http.get<FlatEntity>(`/flat/${params['id']}`))
    );
  }
}
