import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FlatEntity } from '@sf/interfaces/modules/flat/entities/flat.entity';
import { FlatIslandComponent } from '../../../shared/flat-island/flat-island.component';
import { RouterLink } from '@angular/router';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';
import { TUI_PROMPT, TuiPromptData, TuiPromptModule } from '@taiga-ui/kit';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'sf-lk-flats',
  standalone: true,
  imports: [CommonModule, FlatIslandComponent, RouterLink, TuiButtonModule, TuiPromptModule],
  templateUrl: './lk-flats.component.html'
})
export class LkFlatsComponent {
  flats$ = this.http.get<FlatEntity[]>('/flat/my');

  constructor(
    private readonly http: HttpClient,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService
  ) {}

  deleteFlat(flat: FlatEntity): void {
    const data: TuiPromptData = {
      content: `Вы действительно хотите удалить квартиру "${flat.name}"?`,
      yes: 'Да',
      no: 'Нет'
    };

    this.dialogs
      .open<boolean>(TUI_PROMPT, {
        label: 'Подтверждение действия',
        size: 's',
        data
      })
      .pipe(
        filter(Boolean),
        switchMap(() => this.http.delete(`/flat/${flat.id}`)),
        tap(() => (this.flats$ = this.http.get<FlatEntity[]>('/flat/my')))
      )
      .subscribe();
  }
}
