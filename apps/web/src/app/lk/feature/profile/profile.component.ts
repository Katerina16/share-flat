import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/reducers';
import { selectCurrentUser } from '../../../core/store/auth/selectors';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiFormatPhonePipeModule, TuiSvgModule } from '@taiga-ui/core';

@Component({
  selector: 'sf-lk',
  standalone: true,
  imports: [CommonModule, TuiIslandModule, TuiSvgModule, TuiFormatPhonePipeModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  user$ = this.store.select(selectCurrentUser);

  constructor(private readonly store: Store<AppState>) {}
}
