import { Component, inject } from '@angular/core';
import { GameService } from '../../services/game.service';
import { BoardComponent } from '../../shared/components/board/board.component';
import { EndGameModalComponent } from '../../shared/components/end-game-modal/end-game-modal.component';
import { KeyboardComponent } from '../../shared/components/keyboard/keyboard.component';

const IMPORTS = [BoardComponent, KeyboardComponent, EndGameModalComponent];

@Component({
  selector: 'app-single',
  imports: IMPORTS,
  templateUrl: './single.component.html',
  styleUrl: './single.component.css',
})
export class SingleComponent {
  protected gameService = inject(GameService);
}
