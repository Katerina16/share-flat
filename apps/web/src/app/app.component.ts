import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiAlertModule, TuiDialogModule, TuiRootModule } from '@taiga-ui/core';

@Component({
  selector: 'sf-root',
  standalone: true,
  imports: [
    RouterModule,
    TuiRootModule,
    TuiAlertModule,
    TuiDialogModule
  ],
  template: `
    <tui-root>
      <router-outlet></router-outlet>
    </tui-root>
  `
})
export class AppComponent {

}
