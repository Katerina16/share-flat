import { Component, Inject, Injector, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/reducers';
import { selectCurrentUser } from '../../../core/store/auth/selectors';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiDialogService, TuiFormatPhonePipeModule, TuiSvgModule } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { AuthEffects } from '../../../core/store/auth/effects';
import { takeUntil } from 'rxjs';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';
import { Router } from '@angular/router';

@Component({
  selector: 'sf-lk',
  standalone: true,
  imports: [CommonModule, TuiIslandModule, TuiSvgModule, TuiFormatPhonePipeModule, TuiButtonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user$ = this.store.select(selectCurrentUser);

  private readonly dialog = this.dialogService.open<number>(
    new PolymorpheusComponent(ProfileEditComponent, this.injector),
    {
      dismissible: true
    }
  );

  constructor(
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector,
    private readonly store: Store<AppState>,
    private readonly authEffects: AuthEffects,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.authEffects.logout$.subscribe(() => this.router.navigate(['/']));
  }

  openEditProfileModal(): void {
    this.dialog.pipe(takeUntil(this.authEffects.updateUserSuccess$)).subscribe();
  }
}
