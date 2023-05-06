import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sf-flat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flat-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatListComponent {}
