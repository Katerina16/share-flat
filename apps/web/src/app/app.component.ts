import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiRootModule } from '@taiga-ui/core';

@Component({
  selector: 'sf-root',
  standalone: true,
  imports: [
    RouterModule,
    TuiRootModule,
    HttpClientModule
  ],
  template: `
    <tui-root>
      <router-outlet></router-outlet>
    </tui-root>
  `
})
export class AppComponent {
  constructor(private readonly http: HttpClient) {
    this.http.get('/api/test').subscribe();
  }
}
