import { Component, inject } from '@angular/core';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-keyboard',
  imports: [],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.css',
})
export class KeyboardComponent {
  private gameService = inject(GameService);

  keys: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç', '⌫'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER'],
  ];

  keyPressed(key: string) {
    this.gameService.handleKeyPress(key);
  }
}
