import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';
import { FlatIslandComponent } from '../../../shared/flat-island/flat-island.component';
import { RouterLink } from '@angular/router';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';
import { TUI_PROMPT, TuiPromptData, TuiPromptModule } from '@taiga-ui/kit';
import { filter, switchMap, tap } from 'rxjs';
import { FlatService } from '../../../core/services/flat.service';

@Component({
  selector: 'sf-lk-flats',
  standalone: true,
  imports: [CommonModule, FlatIslandComponent, RouterLink, TuiButtonModule, TuiPromptModule],
  templateUrl: './lk-flats.component.html'
})
export class LkFlatsComponent {
  flats$ = this.flatService.getOwnFlats();

  constructor(
    private readonly flatService: FlatService,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService
  ) {}

  deleteFlat(flat: FlatEntity): void {
    const data: TuiPromptData = {
      content: `Вы действительно хотите удалить квартиру "${flat.name}"?`,
      yes: 'Да',
      no: 'Нет'
    };

    this.dialogs
      .open<boolean>(TUI_PROMPT, { label: 'Подтверждение действия', size: 's', data })
      .pipe(
        filter(Boolean),
        switchMap(() => this.flatService.deleteFlat(flat.id)),
        tap(() => (this.flats$ = this.flatService.getOwnFlats()))
      )
      .subscribe();
  }
}
