import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiDataListModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiInputCountModule, TuiInputDateRangeModule, TuiInputModule, TuiSelectModule } from '@taiga-ui/kit';


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
    TuiInputCountModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  items = ['Москва', 'Санкт-Петербург', 'Сочи'];

  form = this.fb.group({
    city: null,
    period: null,
    guests: 1
  });

  constructor(private readonly fb: FormBuilder) {
  }
}
