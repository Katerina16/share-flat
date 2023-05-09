import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CityEntity } from '@sf/interfaces/modules/city/entities/city.entity';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiCarouselModule, TuiIslandModule } from '@taiga-ui/kit';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { BehaviorSubject, Observable, combineLatest, map, startWith, switchMap, tap } from 'rxjs';
import { FlatSearhItemComponent } from '../../ui/flat-searh-item/flat-searh-item.component';

interface SearchParams {
  city: string;
  from: string;
  to: string;
  shared: string;
  guests: string;
}


@Component({
  selector: 'sf-flat-list',
  standalone: true,
  imports: [
    CommonModule,
    FlatSearhItemComponent,
    TuiIslandModule,
    TuiCarouselModule,
    RouterModule,
    TuiSvgModule
  ],
  templateUrl: './flat-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatListComponent implements OnInit {

  flats$: Observable<FlatEntity[]>;
  params$: Observable<SearchParams>;
  loading$ = new BehaviorSubject(false);
  cities$ = this.http.get<CityEntity[]>('/city');

  vm$: Observable<{ flats: FlatEntity[], daysCount: number, loading: boolean }>;

  daysCount$: Observable<number>;

  imageIndexes: Record<number, number> = {};

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.params$ = combineLatest([this.route.queryParams, this.cities$]).pipe(
      map(([params, cities]) => ({
        city: params['city'] || cities[0]?.id?.toString(),
        from: params['from'] || new Date().toISOString().substring(0, 10),
        to: params['to'] || new Date().toISOString().substring(0, 10),
        shared: params['shared'] || 'false',
        guests: params['guests'] || '1'
      }))
    );
    this.daysCount$ = this.params$.pipe(
      map(params => differenceInCalendarDays(new Date(params.to), new Date(params.from)) + 1)
    );

    this.flats$ = this.params$.pipe(
      switchMap(params => this.http.get<FlatEntity[]>('/flat', { params: { ...params } })),
      tap((flats) => {
        this.imageIndexes = flats.reduce((res, flat) => {
          res[flat.id] = 0;
          return res;
        }, this.imageIndexes);
      })
    );

    this.vm$ = combineLatest([this.flats$, this.daysCount$, this.loading$]).pipe(
      map(([flats, daysCount, loading]) => ({ flats, daysCount, loading })),
      startWith({ flats: [], daysCount: 1, loading: true })
    );
  }

}
