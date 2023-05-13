export class SearchParams {
  city: string;
  from: string;
  to: string;
  shared: boolean;
  guests: number;
  limit: number;
  offset: number;
  rooms?: number;
  squareFrom?: number;
  squareTo?: number;
  priceFrom?: number;
  priceTo?: number;
  properties?: number[];
}
