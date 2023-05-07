import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiModeModule, TuiSvgModule } from '@taiga-ui/core';
import { selectCurrentUser } from '../../core/store/auth/selectors';
import { AppState } from '../../core/store/reducers';
import { UserMenuComponent } from '../../shared/user-menu/user-menu.component';


@Component({
  selector: 'sf-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TuiModeModule,
    TuiSvgModule,
    UserMenuComponent
  ],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  user$ = this.store.select(selectCurrentUser);
  constructor(private readonly store: Store<AppState>) { }
}
