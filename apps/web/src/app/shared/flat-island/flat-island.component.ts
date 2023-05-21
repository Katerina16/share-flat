import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiCarouselModule, TuiIslandModule } from '@taiga-ui/kit';
import { TuiSvgModule } from '@taiga-ui/core';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';

@Component({
  selector: 'sf-flat-island',
  standalone: true,
  imports: [CommonModule, TuiCarouselModule, TuiIslandModule, TuiSvgModule],
  templateUrl: './flat-island.component.html'
})
export class FlatIslandComponent {
  @Input() flat: FlatEntity;
  @Input() daysCount: number;
  imageIndex = 0;
}
