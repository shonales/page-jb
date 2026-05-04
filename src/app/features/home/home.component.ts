import { Component, computed, EventEmitter, Output } from '@angular/core';
import { coupleProfile } from '../../shared/data/couple.data';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @Output() navigateTo = new EventEmitter<string>();

  profile = coupleProfile;
  daysTogether = computed(() => {
    const start = new Date(`${this.profile.anniversary}T00:00:00`);
    const today = new Date();
    const diff = today.getTime() - start.getTime();
    return Math.max(0, Math.floor(diff / 86_400_000));
  });

  nextAnniversary = computed(() => {
    const today = new Date();
    const next = new Date(today.getFullYear(), 4, 4);
    if (next < today) {
      next.setFullYear(today.getFullYear() + 1);
    }

    return Math.ceil((next.getTime() - today.getTime()) / 86_400_000);
  });
}
