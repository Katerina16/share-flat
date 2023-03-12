import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TuiLinkModule, TuiModeModule } from '@taiga-ui/core';
import { Subscription } from 'rxjs';
import { AuthEffects } from '../../../core/store/auth/effects';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'sf-auth',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent, TuiLinkModule, TuiModeModule],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit, OnDestroy {
  type: 'login' | 'register' = 'login';

  successSub: Subscription;

  constructor(private readonly authEffects: AuthEffects) { }

  ngOnInit(): void {
    this.successSub = this.authEffects.registerSuccess$.subscribe(() => this.type = 'login');
  }

  ngOnDestroy(): void {
    this.successSub?.unsubscribe();
  }
}
