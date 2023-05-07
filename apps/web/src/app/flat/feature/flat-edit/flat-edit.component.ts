import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CityEntity } from '@sf/interfaces/modules/city/entities/city.entity';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';
import { PropertyEntity } from '@sf/interfaces/modules/flat/entities/property.entity';
import { TuiCurrencyPipeModule } from '@taiga-ui/addon-commerce';
import { TuiAlertService, TuiButtonModule, TuiDataListModule, TuiErrorModule, TuiNotification, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiCheckboxLabeledModule, TuiDataListWrapperModule, TuiFieldErrorPipeModule, TuiInputCountModule, TuiInputDateModule, TuiInputFilesModule, TuiInputModule, TuiInputNumberModule, TuiInputPhoneModule, TuiSelectModule, TuiTextAreaModule, tuiItemsHandlersProvider } from '@taiga-ui/kit';
import { combineLatest, concatMap, delay, filter, from, map, mergeMap, of, switchMap, toArray } from 'rxjs';
import { selectCurrentUser } from '../../../core/store/auth/selectors';
import { AppState } from '../../../core/store/reducers';
import { formValidatorProvider } from '../../../shared/form-validators-provider';
import { LoginButtonComponent } from '../../../shared/login-button/login-button.component';
import { ExampleNativeDateTransformerDirective } from '../../../shared/to-native-date.directive';


@Component({
  selector: 'sf-flat-edit',
  standalone: true,
  providers: [formValidatorProvider, tuiItemsHandlersProvider({ stringify: (city: CityEntity) => city.name })],
  templateUrl: './flat-edit.component.html',
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
    TuiSvgModule,
    TuiTextfieldControllerModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiSelectModule
  ]
})
export class FlatEditComponent implements OnInit {

  form: FormGroup;
  filesControl = new FormControl();
  flat: FlatEntity;

  cities$ = this.http.get<CityEntity[]>('/city');

  user$ = this.store.select(selectCurrentUser);

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private alertService: TuiAlertService
  ) { }

  get propertiesControls(): FormGroup[] {
    return ((this.form.get('propertyValues') as FormArray)?.controls) as FormGroup[];
  }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => combineLatest([
        this.http.get<FlatEntity>(`/flat/${params['id']}`),
        this.user$
      ])),
      filter(([flat, user]) => {
        if (flat.user.id !== user?.id) {
          this.alertService.open('Ошибка доступа', { status: TuiNotification.Error }).subscribe();
          this.router.navigate(['/']).catch(console.error);
          return false;
        }
        return true;
      }),
      switchMap(([flat]) => {
        return this.http.get<PropertyEntity[]>('/flat/properties')
          .pipe(
            map(properties => ({ flat, properties }))
          );
      })
    ).subscribe(({ flat, properties }) => {
      this.flat = flat;
      this.form = new FormGroup({
        name: new FormControl(flat.name, { nonNullable: true, validators: Validators.required }),
        city: new FormControl(flat.city, { nonNullable: true, validators: Validators.required }),
        address: new FormControl(flat.address, { nonNullable: true, validators: Validators.required }),
        latitude: new FormControl(flat.latitude, { nonNullable: true, validators: Validators.required }),
        longitude: new FormControl(flat.longitude, { nonNullable: true, validators: Validators.required }),
        square: new FormControl(flat.square, { nonNullable: true, validators: Validators.required }),
        floor: new FormControl(flat.floor, { nonNullable: true, validators: Validators.required }),
        floors: new FormControl(flat.floors, { nonNullable: true, validators: Validators.required }),
        description: new FormControl(flat.description, { nonNullable: true, validators: Validators.required }),
        price: new FormControl(flat.price, { nonNullable: true, validators: Validators.required }),
        shared: new FormControl(flat.shared, { nonNullable: true, validators: Validators.required }),
        rooms: new FormControl(flat.rooms, { nonNullable: true, validators: Validators.required }),
        guests: new FormControl(flat.guests, { nonNullable: true, validators: Validators.required })
      });

      this.form.addControl(
        'propertyValues',
        new FormArray(properties.map(p => new FormGroup({
          value: new FormControl(this.flat.propertyValues.find(pv => pv.property.id === p.id)?.value || false),
          property: new FormGroup({
            id: new FormControl(p.id),
            name: new FormControl(p.name)
          })
        }))));

      this.cdRef.detectChanges();
    });
  }

  deletePhoto(photo: string): void {
    this.http.delete(`/flat/${this.flat.id}/photo/${photo}`).subscribe(() => {
      this.flat.photos = this.flat.photos.filter(p => p !== photo);
    });
  }

  removeFile({ name }: File): void {
    this.filesControl.setValue(
      this.filesControl.value?.filter((current: File) => current.name !== name) ?? []
    );
  }

  save(): void {
    this.http.put<FlatEntity>(`/flat/${this.flat.id}`, this.form.value)
      .pipe(
        mergeMap(() => from((this.filesControl.value || []) as File[]).pipe(
          concatMap(item => of(item).pipe(delay(10)))
        )),
        mergeMap((file) => {
          const formData = new FormData();
          formData.append('file', file, file.name);
          return this.http.post(`/flat/${this.flat.id}/photo`, formData);
        }),
        toArray()
      )
      .subscribe(() => this.router.navigate([`/flat/card/${this.flat.id}`]));
  }

}
