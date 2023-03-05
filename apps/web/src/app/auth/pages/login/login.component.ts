import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiInputModule, TuiIslandModule } from '@taiga-ui/kit';


@Component({
  selector: 'sf-login',
  standalone: true,
  imports: [CommonModule, TuiButtonModule, TuiInputModule, TuiIslandModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent { }
