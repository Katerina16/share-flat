import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TuiButtonModule, TuiErrorModule } from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiInputDateModule, TuiInputModule, TuiInputPhoneModule } from '@taiga-ui/kit';
import * as AuthActions from '../../../core/store/auth/actions';
import * as AuthSelectors from '../../../core/store/auth/selectors';
import { selectCurrentUser } from '../../../core/store/auth/selectors';
import { AppState } from '../../../core/store/reducers';
import { formValidatorProvider } from '../../../shared/form-validators-provider';
import { ExampleNativeDateTransformerDirective } from '../../../shared/to-native-date.directive';
import { tap } from 'rxjs';
import { TuiDay } from '@taiga-ui/cdk';

@Component({
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
  templateUrl: './profile-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileEditComponent implements OnInit {
  form: UntypedFormGroup;

  loading$ = this.store.select(AuthSelectors.selectLoading);

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.store
      .select(selectCurrentUser)
      .pipe(
        tap((user) => {
          if (user) {
            this.form = new UntypedFormGroup({
              firstName: new FormControl(user.firstName, { nonNullable: true }),
              lastName: new FormControl(user.lastName, { nonNullable: true, validators: Validators.required }),
              middleName: new FormControl(user.middleName, { nonNullable: true, validators: Validators.required }),
              birthDate: new FormControl(new Date(user.birthDate), {
                nonNullable: true,
                validators: Validators.required
              }),
              phone: new FormControl(user.phone, { nonNullable: true, validators: Validators.required })
            });
          }
        })
      )
      .subscribe();
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const userData = this.form.getRawValue();

    this.store.dispatch(
      AuthActions.updateUser({
        user: {
          ...userData,
          birthDate: TuiDay.fromLocalNativeDate(userData.birthDate).toUtcNativeDate()
        }
      })
    );
  }
}
