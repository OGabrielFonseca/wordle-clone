import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordsService } from './services/words.service';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
  protected title = 'wordle-clone';

  private wordsService = inject(WordsService);

  constructor() {
    this.wordsService.loadAll().subscribe(data => {
      this.wordsService.init(data);
    });
  }
}
