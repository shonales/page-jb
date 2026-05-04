import { Component, computed } from '@angular/core';
import { coupleProfile } from '../../shared/data/couple.data';

@Component({
  selector: 'app-memory-vault',
  standalone: true,
  templateUrl: './memory-vault.component.html',
  styleUrl: './memory-vault.component.scss',
})
export class MemoryVaultComponent {
  profile = coupleProfile;

  nextMilestone = computed(() => {
    const anniversary = new Date(`${this.profile.anniversary}T00:00:00`);
    const thousandDays = new Date(anniversary);
    thousandDays.setDate(anniversary.getDate() + 1000);
    return thousandDays.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  });
}
