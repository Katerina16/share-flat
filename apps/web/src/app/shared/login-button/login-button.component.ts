import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { TuiDialogModule, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs';
import { AuthComponent } from '../../auth/pages/auth/auth.component';
import { AuthEffects } from '../../core/store/auth/effects';

@Component({
  selector: 'sf-login-button',
  standalone: true,
  imports: [CommonModule, TuiDialogModule],
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginButtonComponent {
  private readonly dialog = this.dialogService.open<number>(
    new PolymorpheusComponent(AuthComponent, this.injector),
    { dismissible: true }
  );

  constructor(
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(Injector) private readonly injector: Injector,
    private readonly authEffects: AuthEffects
  ) { }

  public showDialog(): void {
    this.dialog.pipe(takeUntil(this.authEffects.loginSuccess$)).subscribe();
  }
}
