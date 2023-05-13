import { City } from './city.model';
import { FlatPropertyInterface } from './flat-property.model';
import { TuiDayRange } from '@taiga-ui/cdk/date-time/day-range';

export interface SearchFilters {
  city: City;
  dates: TuiDayRange;
  shared: boolean;
  rooms?: number;
  guests: number;
  squareFrom?: number;
  squareTo?: number;
  priceFrom?: number;
  priceTo?: number;
  properties: {
    property: FlatPropertyInterface;
    value: boolean;
  }[];
}
