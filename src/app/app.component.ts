import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TileStatus } from './shared/enums/tile-status.enum';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
  TileStatus = TileStatus;
  protected title = 'wordle-clone';
}
