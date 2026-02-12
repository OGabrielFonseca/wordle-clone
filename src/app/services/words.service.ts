import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  http = inject(HttpClient);

  private validWordsList: string[] = [];
  private validAccentedWordsList: string[] = [];

  dailyWord: WritableSignal<string> = signal('');
  dailyWordAccented: WritableSignal<string> = signal('');

  loadAll() {
    return forkJoin({
      valid: this.http.get<string[]>('assets/words/valid_words.json'),
      accented: this.http.get<string[]>('assets/words/valid_accentuated_word.json'),
    });
  }

  init(data: { valid: string[]; accented: string[] }) {
    // guarda arrays
    this.validWordsList = data.valid;
    this.validAccentedWordsList = data.accented;

    const [raw, display] = this.getWordOfTheDay();

    this.dailyWord.set(raw);
    this.dailyWordAccented.set(display);
  }

  setRandomWord(): void {
    const randomIndex = Math.floor(Math.random() * this.validWordsList.length);

    const raw = this.validWordsList[randomIndex].toUpperCase();
    const display = this.validAccentedWordsList[randomIndex].toUpperCase();

    this.dailyWord.set(raw);
    this.dailyWordAccented.set(display);
  }

  isValidWord(word: string): boolean {
    return this.validWordsList.includes(word.toLowerCase());
  }

  private getWordOfTheDay(): [string, string] {
    const index = this.getDailyIndex();

    const raw = this.validWordsList[index].toUpperCase();
    const display = this.validAccentedWordsList[index].toUpperCase();

    return [raw, display];
  }

  private getDailyIndex(): number {
    const start = new Date(2022, 0, 1);
    const today = new Date();

    const diff = Math.floor((today.getTime() - start.getTime()) / 86400000);

    return diff % this.validWordsList.length;
  }
}
