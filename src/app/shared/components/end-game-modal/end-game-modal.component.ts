import { Component, inject } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { WordsService } from '../../../services/words.service';

@Component({
  selector: 'app-end-game-modal',
  imports: [],
  templateUrl: './end-game-modal.component.html',
  styleUrl: './end-game-modal.component.css',
})
export class EndGameModalComponent {
  protected gameService = inject(GameService);
  protected wordsService = inject(WordsService);

  resetGame(): void {
    this.gameService.resetGame();
    this.wordsService.setRandomWord();
  }
}
