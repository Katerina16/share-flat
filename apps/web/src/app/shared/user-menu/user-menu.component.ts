import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { LoginButtonComponent } from '../login-button/login-button.component';

import { Store } from '@ngrx/store';
import * as AuthActions from '../../core/store/auth/actions';
import * as AuthSelectors from '../../core/store/auth/selectors';
import { AppState } from '../../core/store/reducers';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sf-user-menu',
  standalone: true,
  imports: [CommonModule, LoginButtonComponent, TuiButtonModule, TuiAvatarModule, RouterLink],
  templateUrl: './user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuComponent implements OnInit {
  user$ = this.store.select(AuthSelectors.selectCurrentUser);

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.tryGetCurrentUser());
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
