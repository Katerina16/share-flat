import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiCarouselModule, TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'sf-flat-searh-item',
  standalone: true,
  imports: [CommonModule, TuiIslandModule, TuiCarouselModule],
  templateUrl: './flat-searh-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatSearhItemComponent {

}
