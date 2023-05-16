import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import {
  TuiCheckboxLabeledModule,
  TuiDataListWrapperModule,
  TuiInputCountModule,
  TuiInputDateRangeModule,
  TuiInputModule,
  TuiInputNumberModule,
  tuiItemsHandlersProvider,
  TuiSelectModule
} from '@taiga-ui/kit';
import { City } from '../../models/city.model';
import { FlatPropertyInterface } from '../../models/flat-property.model';
import { SearchFilters } from '../../models/seacrh-filters.model';
import { SearchParams } from '../../models/search-params.model';
import { CityEntity } from '@sf/interfaces/modules/city/entities/city.entity';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';

@Component({
  selector: 'sf-flat-filters',
  standalone: true,
  imports: [
    CommonModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiButtonModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiSelectModule,
    ReactiveFormsModule,
    TuiInputDateRangeModule,
    TuiInputCountModule,
    TuiCheckboxLabeledModule,
    FormsModule,
    TuiHostedDropdownModule,
    TuiInputNumberModule
  ],
  providers: [tuiItemsHandlersProvider({ stringify: (city: CityEntity) => city.name })],
  templateUrl: './flat-filters.component.html'
})
export class FlatFiltersComponent implements OnInit {
  @Input() params: SearchParams;
  @Output() paramsChange = new EventEmitter<SearchParams>();

  @Input() cities: City[];
  @Input() flatProperties: FlatPropertyInterface[];

  filters: SearchFilters;
  extraFiltersOpen = false;

  ngOnInit(): void {
    this.filters = {
      city: this.cities.find(city => city.id === +this.params.city) || this.cities[0],
      dates: new TuiDayRange(
        TuiDay.fromLocalNativeDate(new Date(this.params.from)),
        TuiDay.fromLocalNativeDate(new Date(this.params.to))
      ),
      shared: this.params.shared,
      guests: this.params.guests,
      properties: this.flatProperties.map(property => ({
        property,
        value: false
      }))
    };
  }

  search(): void {
    const params = {
      city: this.filters.city.id.toString(),
      from: this.filters.dates.from.toUtcNativeDate().toISOString().substring(0, 10),
      to: this.filters.dates.to.toUtcNativeDate().toISOString().substring(0, 10),
      shared: this.filters.shared,
      guests: this.filters.guests || undefined,
      rooms: this.filters.rooms || undefined,
      squareFrom: this.filters.squareFrom || undefined,
      squareTo: this.filters.squareTo || undefined,
      priceFrom: this.filters.priceFrom || undefined,
      priceTo: this.filters.priceTo || undefined,
      properties: this.filters.properties.filter(prop => prop.value).map(prop => prop.property.id),
      limit: 10,
      offset: 0
    };
    const definedProperties = Object.entries(params).reduce((res, [key, value]) => {
      return value === undefined ? res : { ...res, [key]: value };
    }, new SearchParams());
    this.paramsChange.emit(definedProperties);
  }
}
