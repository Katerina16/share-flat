import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiButtonModule, TuiModeModule, TuiSvgModule } from '@taiga-ui/core';


@Component({
  selector: 'sf-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, TuiModeModule, TuiButtonModule, TuiSvgModule],
  templateUrl: './layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {

}
