import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LoginUserDto } from '@sf/interfaces/modules/user/dto/login.user.dto';
import { TuiButtonModule, TuiErrorModule } from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiInputModule, TuiIslandModule } from '@taiga-ui/kit';
import { AppState } from '../../../core/store/reducers';

import * as AuthActions from '../../../core/store/auth/actions';
import * as AuthSelectors from '../../../core/store/auth/selectors';
import { formValidatorProvider } from '../../../shared/form-validators-provider';

type LoginForm = {
  [P in keyof LoginUserDto]: FormControl<LoginUserDto[P]>;
};

@Component({
  selector: 'sf-login',
  standalone: true,
  imports: [
    CommonModule,
    TuiButtonModule,
    TuiInputModule,
    TuiIslandModule,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule
  ],
  providers: [formValidatorProvider],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  form: FormGroup<LoginForm>;

  loading$ = this.store.select(AuthSelectors.selectLoading);

  constructor(private readonly store: Store<AppState>) { }

  ngOnInit(): void {
    this.form = new FormGroup<LoginForm>({
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { nonNullable: true, validators: Validators.required })
    });
  }

  login(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.store.dispatch(AuthActions.login({ data: this.form.getRawValue() }));
  }
}
