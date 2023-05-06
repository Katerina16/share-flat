import { FormControl } from '@angular/forms';

export type TypedForm<T> = {
  [P in keyof T]: FormControl<T[P]>;
};
