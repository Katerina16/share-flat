import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CityEntity } from '@sf/interfaces/modules/city/entities/city.entity';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import {
  TuiCheckboxLabeledModule,
  TuiDataListWrapperModule,
  TuiInputCountModule,
  TuiInputDateRangeModule,
  TuiInputModule,
  tuiItemsHandlersProvider,
  TuiSelectModule
} from '@taiga-ui/kit';
import { addDays, isAfter } from 'date-fns';

interface HomeSearchForm {
  city: FormControl<CityEntity | null>;
  period: FormControl<TuiDayRange | null>;
  guests: FormControl<number>;
  shared: FormControl<boolean>;
}

@Component({
  selector: 'sf-notes',
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
    TuiCheckboxLabeledModule
  ],
  providers: [tuiItemsHandlersProvider({ stringify: (city: CityEntity) => city.name })],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  cities$ = this.http.get<CityEntity[]>('/city');

  form = new FormGroup<HomeSearchForm>({
    city: new FormControl(null, { validators: Validators.required }),
    period: new FormControl(null, { validators: Validators.required }),
    guests: new FormControl(1, { nonNullable: true }),
    shared: new FormControl(false, { nonNullable: true })
  });

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  isDateDisabled(day: TuiDay): boolean {
    return isAfter(new Date(), addDays(day.toUtcNativeDate(), 1));
  }

  search(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.getRawValue();

    const queryParams = {
      city: formValue.city?.id,
      guests: formValue.guests,
      from: formValue.period?.from.toUtcNativeDate().toISOString().substring(0, 10),
      to: formValue.period?.to.toUtcNativeDate().toISOString().substring(0, 10),
      shared: formValue.shared
    };
    
    this.router.navigate(['/flat/search'], { queryParams }).catch(console.error);
  }
}
