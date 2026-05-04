import { Component } from '@angular/core';

@Component({
  selector: 'app-games',
  standalone: true,
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss',
})
export class GamesComponent {
  ideas = [
    'Memoria con sus fotos',
    'Quiz de cuanto se conocen',
    'Ruleta de citas',
    'Puzzle de una foto especial',
  ];
}
