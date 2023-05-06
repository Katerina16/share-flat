import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CreateUserDto } from '@sf/interfaces/modules/user/dto/create.user.dto';
import { TuiButtonModule, TuiErrorModule } from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiInputDateModule, TuiInputModule, TuiInputPhoneModule } from '@taiga-ui/kit';
import * as AuthActions from '../../../core/store/auth/actions';
import * as AuthSelectors from '../../../core/store/auth/selectors';
import { AppState } from '../../../core/store/reducers';
import { formValidatorProvider } from '../../../shared/form-validators-provider';
import { ExampleNativeDateTransformerDirective } from '../../../shared/to-native-date.directive';


type RegisterForm = {
  [P in keyof CreateUserDto]: FormControl<CreateUserDto[P]>;
};


@Component({
  selector: 'sf-register',
  standalone: true,
  imports: [
    CommonModule,
    TuiInputModule,
    TuiButtonModule,
    TuiInputPhoneModule,
    TuiInputDateModule,
    ReactiveFormsModule,
    ExampleNativeDateTransformerDirective,
    TuiErrorModule,
    TuiFieldErrorPipeModule
  ],
  providers: [formValidatorProvider],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  form: FormGroup<RegisterForm>;

  loading$ = this.store.select(AuthSelectors.selectLoading);

  constructor(private readonly store: Store<AppState>) { }

  ngOnInit(): void {
    this.form = new FormGroup<RegisterForm>({
      firstName: new FormControl('', { nonNullable: true }),
      lastName: new FormControl('', { nonNullable: true, validators: Validators.required }),
      middleName: new FormControl('', { nonNullable: true, validators: Validators.required }),
      birthDate: new FormControl(new Date, { nonNullable: true, validators: Validators.required }),
      phone: new FormControl('', { nonNullable: true, validators: Validators.required }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { nonNullable: true, validators: Validators.required })
    });
  }

  register(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.store.dispatch(AuthActions.register({ data: this.form.getRawValue() }));
  }
}
