import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiCarouselModule, TuiIslandModule } from '@taiga-ui/kit';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { BehaviorSubject, combineLatest, filter, map, Observable, shareReplay, switchMap, take, tap } from 'rxjs';
import { City } from '../../models/city.model';
import { FlatsData } from '../../models/flats-data.model';
import { SearchParams } from '../../models/search-params.model';
import { FlatFiltersComponent } from '../../ui/flat-filters/flat-filters.component';
import { FlatSearhItemComponent } from '../../ui/flat-searh-item/flat-searh-item.component';
import { FlatPropertyInterface } from '../../models/flat-property.model';
import { FlatIslandComponent } from '../../../shared/flat-island/flat-island.component';

@Component({
  selector: 'sf-flat-list',
  standalone: true,
  imports: [
    CommonModule,
    FlatSearhItemComponent,
    TuiIslandModule,
    TuiCarouselModule,
    RouterModule,
    TuiSvgModule,
    FlatFiltersComponent,
    FlatIslandComponent
  ],
  templateUrl: './flat-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatListComponent implements OnInit, AfterViewInit {
  private flatsData$ = new BehaviorSubject<FlatsData>({
    flats: [],
    count: 0
  });

  private params$ = new BehaviorSubject<SearchParams>(new SearchParams());
  private loading$ = new BehaviorSubject(false);
  private daysCount$: Observable<number>;

  private cities$ = this.http.get<City[]>('/city').pipe(shareReplay(1));
  private properties$ = this.http.get<FlatPropertyInterface[]>('/flat/properties').pipe(shareReplay(1));

  vm$: Observable<{
    flatsData: FlatsData;
    daysCount: number;
    loading: boolean;
    cities: City[];
    params: SearchParams;
    properties: FlatPropertyInterface[];
  }>;

  imageIndexes: Record<number, number> = {};

  @ViewChild('endOfList') endOfList: ElementRef;

  endOfListObserver: IntersectionObserver;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    combineLatest([this.route.queryParams, this.cities$])
      .pipe(
        take(1),
        map(([params, cities]) => ({
          city: params['city'] || cities[0]?.id?.toString(),
          from: params['from'] || new Date().toISOString().substring(0, 10),
          to: params['to'] || new Date().toISOString().substring(0, 10),
          shared: params['shared'] === 'true',
          guests: +params['guests'] || 1,
          limit: +params['limit'] || 10,
          offset: +params['offset'] || 0
        })),
        tap(params => this.params$.next(params))
      )
      .subscribe();

    this.params$
      .pipe(
        filter(params => Boolean(params.from && params.to && params.city)),
        tap((queryParams) => {
          this.router.navigate(['.'], { relativeTo: this.route, queryParams }).catch(console.error);
          this.loading$.next(true);
        }),
        switchMap(params => this.http.get<FlatsData>('/flat', { params: { ...params } })),
        tap((data) => {
          this.imageIndexes = data.flats.reduce((res, flat) => {
            res[flat.id] = 0;
            return res;
          }, this.imageIndexes);

          this.loading$.next(false);
          this.flatsData$.next({
            count: data.count,
            flats: this.flatsData$.value.flats.concat(data.flats)
          });
        })
      )
      .subscribe();

    this.daysCount$ = this.params$.pipe(
      map(params => differenceInCalendarDays(new Date(params.to), new Date(params.from)) + 1)
    );

    this.vm$ = combineLatest([
      this.flatsData$,
      this.daysCount$,
      this.loading$,
      this.cities$,
      this.params$,
      this.properties$
    ]).pipe(
      map(([flatsData, daysCount, loading, cities, params, properties]) => ({
        flatsData,
        daysCount,
        loading,
        cities,
        params,
        properties
      }))
    );
  }

  ngAfterViewInit(): void {
    this.endOfListObserver = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !this.loading$.value &&
          this.flatsData$.value.count > this.flatsData$.value.flats.length
        ) {
          this.params$.next({
            ...this.params$.value,
            offset: this.params$.value.offset + this.params$.value.limit
          });
        }
      },
      { threshold: 0.2 }
    );

    this.endOfListObserver.observe(this.endOfList.nativeElement);
  }

  setFiltersParams(params: SearchParams): void {
    this.flatsData$.next({
      ...this.flatsData$.value,
      flats: []
    });
    this.params$.next(params);
  }
}
