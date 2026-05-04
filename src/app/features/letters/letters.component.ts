import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { starterLetters } from '../../shared/data/couple.data';
import { Letter } from '../../shared/models/memory.models';

@Component({
  selector: 'app-letters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './letters.component.html',
  styleUrl: './letters.component.scss',
})
export class LettersComponent {
  letters = signal<Letter[]>(starterLetters);
  title = signal('');
  body = signal('');

  addLetter(): void {
    if (!this.title().trim() && !this.body().trim()) {
      return;
    }

    const letter: Letter = {
      title: this.title().trim() || 'Carta sin titulo',
      date: new Date().toISOString().slice(0, 10),
      preview: this.body().trim().slice(0, 110) || 'Una carta nueva para completar despues.',
      body: this.body().trim() || 'Escribe aqui tu mensaje.',
    };

    this.letters.update((items) => [letter, ...items]);
    this.title.set('');
    this.body.set('');
  }
}
