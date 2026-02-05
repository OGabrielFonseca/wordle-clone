import { Component, HostListener, inject } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { TileComponent } from '../tile/tile.component';

const IMPORTS = [TileComponent];

@Component({
  selector: 'app-board',
  imports: IMPORTS,
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  gameService = inject(GameService);

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    this.gameService.handleKeyPress(event.key);
  }

  onTileClick(row: number, col: number) {
    this.gameService.setActiveTile(row, col);
  }
}
