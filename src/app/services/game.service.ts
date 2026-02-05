import { Injectable, signal, WritableSignal } from '@angular/core';
import { TileStatus } from '../shared/enums/tile-status.enum';
import { TileData } from '../shared/models/tile-data.model';

const ROWS = 6;
const COLS = 5;
const WORD = 'APPLE';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  board: WritableSignal<TileData[][]> = signal(this.createEmptyBoard());
  currentRow: WritableSignal<number> = signal(0);
  currentCol: WritableSignal<number> = signal(0);

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

  updateLetter(letter: string, status: TileStatus, isActive: boolean, row: number, col: number): void {
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

  handleKeyPress(key: string): void {
    if (key === 'Backspace') {
      this.removeLetter();
    } else if (key === 'Enter') {
      this.submitGuess();
    } else if (/^[a-zA-Z]$/.test(key)) {
      this.addLetter(key.toUpperCase());
    }
  }

  submitGuess(): void {
    const row = this.currentRow();

    const letters = this.board()[row].map(tile => tile.letter);
    if (letters.length < COLS || letters.includes('')) {
      return;
    }
    letters.forEach((letter, index) => {
      if (letter === WORD[index]) {
        this.updateLetter(letter, TileStatus.Correct, false, row, index);
      } else if (WORD.includes(letter)) {
        this.updateLetter(letter, TileStatus.Present, false, row, index);
      } else {
        this.updateLetter(letter, TileStatus.Absent, false, row, index);
      }
    });

    this.currentRow.set(row + 1);
    this.currentCol.set(0);
  }

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
}
