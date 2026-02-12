import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TileStatus } from '../shared/enums/tile-status.enum';
import { TileData } from '../shared/models/tile-data.model';
import { WordsService } from './words.service';

const ROWS = 6;
const COLS = 5;
const ANIMATION_DELAY_MS = 150;

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private wordsService = inject(WordsService);

  board: WritableSignal<TileData[][]> = signal(this.createEmptyBoard());
  currentRow: WritableSignal<number> = signal(0);
  currentCol: WritableSignal<number> = signal(0);
  gameFinished: WritableSignal<boolean> = signal(false);
  gameWon: WritableSignal<boolean> = signal(false);

  setActiveTile(row: number, col: number): void {
    if (row !== this.currentRow()) {
      return;
    }

    this.board.update(board => {
      const current = board[this.currentRow()][this.currentCol()];
      this.updateLetter(current.letter, current.status, false, this.currentRow(), this.currentCol());
      const clicked = board[row][col];
      this.updateLetter(clicked.letter, clicked.status, true, row, col);
      return board;
    });
  }

  handleKeyPress(key: string): void {
    key = key.toUpperCase();
    if (key === 'BACKSPACE' || key === 'DELETE' || key === '⌫') {
      this.removeLetter();
    } else if (key === 'ENTER') {
      this.submitGuess();
    } else if (/^[a-zA-Z]$/.test(key)) {
      this.addLetter(key.toUpperCase());
    }
  }

  resetGame(): void {
    this.board.set(this.createEmptyBoard());
    this.currentRow.set(0);
    this.currentCol.set(0);
    this.gameWon.set(false);
    this.gameFinished.set(false);
  }

  private createEmptyBoard(): TileData[][] {
    const board = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({
        letter: '',
        status: TileStatus.Empty,
        isActive: false,
      })),
    );

    board[0][0].isActive = true;
    return board;
  }

  private addLetter(letter: string): void {
    const row = this.currentRow();
    const col = this.currentCol();

    if (this.board()[row][col].isActive === false) {
      return;
    }

    this.board.update(board => {
      this.updateLetter(letter, TileStatus.Empty, false, row, col);
      const emptyTiles: number[] = [];
      board[row].forEach((tile, index) => {
        if (tile.letter === '') {
          emptyTiles.push(index);
        }
      });

      if (emptyTiles.length === 0) {
        this.currentCol.set(COLS - 1);
        return board;
      }

      const distances = emptyTiles.map(tile => {
        if (tile > col) {
          return tile - col;
        } else {
          return tile + COLS - col;
        }
      });

      const minDistance = Math.min(...distances);
      const nextCol = emptyTiles[distances.indexOf(minDistance)];

      this.updateLetter(board[row][nextCol].letter, board[row][nextCol].status, true, row, nextCol);
      return board;
    });
  }

  private updateLetter(letter: string, status: TileStatus, isActive: boolean, row: number, col: number): void {
    this.board.update(board => {
      board[row][col] = { letter, status, isActive };
      return board;
    });

    if (isActive) {
      this.currentRow.set(row);
      this.currentCol.set(col);
    }
  }

  private removeLetter(): void {
    const row = this.currentRow();
    const col = this.currentCol();

    const current = this.board()[row][col];
    if (current.letter) {
      this.updateLetter('', TileStatus.Empty, true, row, col);
    } else if (col > 0) {
      this.updateLetter('', TileStatus.Empty, false, row, col);
      this.updateLetter('', TileStatus.Empty, true, row, col - 1);
    } else {
      this.updateLetter('', TileStatus.Empty, false, row, col);
      this.updateLetter('', TileStatus.Empty, true, row, COLS - 1);
    }
  }

  private submitGuess(): void {
    if (this.gameWon()) {
      return;
    }

    const row = this.currentRow();

    const letters = this.board()[row].map(tile => tile.letter);
    if (letters.length < COLS || letters.includes('') || !this.wordsService.isValidWord(letters.join(''))) {
      const currentRowIndex = row;

      // coloca status Invalid na linha inteira (pra animar)
      for (let col = 0; col < COLS; col++) {
        const tile = this.board()[currentRowIndex][col];
        this.updateLetter(tile.letter, TileStatus.Invalid, tile.isActive, currentRowIndex, col);
      }

      // depois da animação, volta para Empty
      setTimeout(() => {
        for (let col = 0; col < COLS; col++) {
          const tile = this.board()[currentRowIndex][col];
          if (tile.status === TileStatus.Invalid) {
            this.updateLetter(tile.letter, TileStatus.Empty, tile.isActive, currentRowIndex, col);
          }
        }
      }, 600);

      return;
    }

    const dailyWord = this.wordsService.dailyWord();
    const guessWord = letters.join('');

    letters.forEach((letter, index) => {
      setTimeout(() => {
        if (letter === dailyWord[index]) {
          this.updateLetter(letter, TileStatus.Correct, false, row, index);
        } else if (dailyWord.includes(letter)) {
          this.updateLetter(letter, TileStatus.Present, false, row, index);
        } else {
          this.updateLetter(letter, TileStatus.Absent, false, row, index);
        }

        // só avança a linha depois do último flip
        if (index === COLS - 1 && !this.gameWon()) {
          this.jumpRow();
        }
      }, ANIMATION_DELAY_MS * index);
    });

    // se acertou a palavra, marca vitória depois que terminar os flips
    if (guessWord === dailyWord) {
      setTimeout(() => {
        this.gameWon.set(true);
        this.gameFinished.set(true);
      }, ANIMATION_DELAY_MS * COLS);
    }

    if (row === ROWS - 1) {
      setTimeout(() => {
        this.gameFinished.set(true);
      }, ANIMATION_DELAY_MS * COLS);
    }
  }

  private jumpRow() {
    if (this.currentRow() >= ROWS) {
      return;
    }

    this.currentRow.set(this.currentRow() + 1);
    this.currentCol.set(0);
    this.updateLetter('', TileStatus.Empty, true, this.currentRow(), 0);
  }
}
