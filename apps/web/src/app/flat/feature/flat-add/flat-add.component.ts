import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CityEntity } from '@sf/interfaces/modules/city/entities/city.entity';
import { TuiCurrencyPipeModule } from '@taiga-ui/addon-commerce';
import { TuiButtonModule, TuiDataListModule, TuiErrorModule } from '@taiga-ui/core';
import {
  TuiCheckboxLabeledModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputCountModule,
  TuiInputDateModule,
  TuiInputFilesModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputPhoneModule,
  tuiItemsHandlersProvider,
  TuiSelectModule,
  TuiTextAreaModule
} from '@taiga-ui/kit';
import { concatMap, delay, from, mergeMap, of, tap, toArray } from 'rxjs';
import { selectCurrentUser } from '../../../core/store/auth/selectors';
import { AppState } from '../../../core/store/reducers';
import { formValidatorProvider } from '../../../shared/form-validators-provider';
import { LoginButtonComponent } from '../../../shared/login-button/login-button.component';
import { ExampleNativeDateTransformerDirective } from '../../../shared/to-native-date.directive';
import { CityService } from '../../../core/services/city.service';
import { FlatService } from '../../../core/services/flat.service';

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
  cities$ = this.cityService.getCities();
  user$ = this.store.select(selectCurrentUser);

  constructor(
    private readonly cdRef: ChangeDetectorRef,
    private readonly cityService: CityService,
    private readonly flatService: FlatService,
    private readonly router: Router,
    private readonly store: Store<AppState>
  ) {}

  get propertiesControls(): FormGroup[] {
    return (this.form.get('propertyValues') as FormArray)?.controls as FormGroup[];
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

    this.flatService.getProperties().subscribe((properties) => {
      this.form.addControl(
        'propertyValues',
        new FormArray(
          properties.map(
            p =>
              new FormGroup({
                value: new FormControl(false),
                property: new FormGroup({
                  id: new FormControl(p.id),
                  name: new FormControl(p.name)
                })
              })
          )
        )
      );
    });

    this.cdRef.detectChanges();
  }

  removeFile({ name }: File): void {
    this.filesControl.setValue(this.filesControl.value?.filter((current: File) => current.name !== name) ?? []);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    let flatId: number;
    this.flatService
      .createFlat(this.form.value)
      .pipe(
        tap(flat => (flatId = flat.id)),
        mergeMap(() =>
          from((this.filesControl.value || []) as File[]).pipe(concatMap(item => of(item).pipe(delay(100))))
        ),
        mergeMap((file) => {
          const formData = new FormData();
          formData.append('file', file, file.name);
          return this.flatService.addPhoto(flatId, formData);
        }),
        toArray()
      )
      .subscribe(() => this.router.navigate([`/flat/card/${flatId}`]));
  }
}
