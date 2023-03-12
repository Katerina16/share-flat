import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiModeModule, TuiSvgModule } from '@taiga-ui/core';
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
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
}