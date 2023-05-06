import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CityEntity } from '@sf/interfaces/modules/city/entities/city.entity';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';
import { PropertyEntity } from '@sf/interfaces/modules/flat/entities/property.entity';
import { TuiCurrencyPipeModule } from '@taiga-ui/addon-commerce';
import { TuiButtonModule, TuiDataListModule, TuiErrorModule } from '@taiga-ui/core';
import { TuiCheckboxLabeledModule, TuiDataListWrapperModule, TuiFieldErrorPipeModule, TuiInputCountModule, TuiInputDateModule, TuiInputFilesModule, TuiInputModule, TuiInputNumberModule, TuiInputPhoneModule, TuiSelectModule, TuiTextAreaModule, tuiItemsHandlersProvider } from '@taiga-ui/kit';
import { forkJoin, map, switchMap } from 'rxjs';
import { selectCurrentUser } from '../../../core/store/auth/selectors';
import { AppState } from '../../../core/store/reducers';
import { formValidatorProvider } from '../../../shared/form-validators-provider';
import { LoginButtonComponent } from '../../../shared/login-button/login-button.component';
import { ExampleNativeDateTransformerDirective } from '../../../shared/to-native-date.directive';


@Component({
  selector: 'sf-flat-add',
  standalone: true,
  providers: [formValidatorProvider, tuiItemsHandlersProvider({ stringify: (city: CityEntity) => city.name })],
  templateUrl: './flat-add.component.html',
  imports: [
    CommonModule,
    TuiInputModule,
    TuiButtonModule,
    TuiInputPhoneModule,
    TuiInputDateModule,
    ReactiveFormsModule,
    ExampleNativeDateTransformerDirective,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputNumberModule,
    TuiTextAreaModule,
    TuiInputCountModule,
    TuiCurrencyPipeModule,
    TuiCheckboxLabeledModule,
    LoginButtonComponent,
    TuiInputFilesModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiSelectModule
  ]
})
export class FlatAddComponent implements OnInit {

  form: FormGroup;

  filesControl = new FormControl();
  cities$ = this.http.get<CityEntity[]>('/city');
  user$ = this.store.select(selectCurrentUser);

  constructor(
    private readonly store: Store<AppState>,
    private readonly http: HttpClient,
    private readonly router: Router
  ) { }

  get propertiesControls(): FormGroup[] {
    return ((this.form.get('propertyValues') as FormArray)?.controls) as FormGroup[];
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: Validators.required }),
      city: new FormControl(null, { nonNullable: true, validators: Validators.required }),
      address: new FormControl('', { nonNullable: true, validators: Validators.required }),
      latitude: new FormControl(0, { nonNullable: true, validators: Validators.required }),
      longitude: new FormControl(0, { nonNullable: true, validators: Validators.required }),
      square: new FormControl(0, { nonNullable: true, validators: Validators.required }),
      floor: new FormControl(1, { nonNullable: true, validators: Validators.required }),
      floors: new FormControl(1, { nonNullable: true, validators: Validators.required }),
      description: new FormControl('', { nonNullable: true, validators: Validators.required }),
      price: new FormControl(0, { nonNullable: true, validators: Validators.required }),
      shared: new FormControl(false, { nonNullable: true, validators: Validators.required }),
      rooms: new FormControl(1, { nonNullable: true, validators: Validators.required }),
      guests: new FormControl(1, { nonNullable: true, validators: Validators.required })
    });

    this.http.get<PropertyEntity[]>('/flat/properties').subscribe((properties) => {
      this.form.addControl(
        'propertyValues',
        new FormArray(properties.map(p => new FormGroup({
          value: new FormControl(false),
          property: new FormGroup({
            id: new FormControl(p.id),
            name: new FormControl(p.name)
          })
        }))));
    });

  }

  removeFile({ name }: File): void {
    this.filesControl.setValue(
      this.filesControl.value?.filter((current: File) => current.name !== name) ?? []
    );
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.http.post<FlatEntity>('/flat', this.form.value)
      .pipe(
        switchMap(flat => forkJoin(this.filesControl.value.map((file: File) => {
          const formData = new FormData();
          formData.append('file', file, file.name);
          return this.http.post(`/flat/${flat.id}/photo`, formData);
        })).pipe(map(() => flat.id)))
      )
      .subscribe(flatId => this.router.navigate([`/flat/card/${flatId}`]));
  }

}
