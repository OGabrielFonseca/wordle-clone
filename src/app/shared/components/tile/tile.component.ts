import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TileStatus } from '../../enums/tile-status.enum';

const IMPORTS = [CommonModule];

@Component({
  selector: 'app-tile',
  imports: IMPORTS,
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.css',
})
export class TileComponent {
  @Input({ required: true }) letter = '';
  @Input() status: TileStatus = TileStatus.Empty;
  @Input() isActive = false;
  @Output() tileClick = new EventEmitter<void>();

  onClick() {
    this.tileClick.emit();
  }
}
