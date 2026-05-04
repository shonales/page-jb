import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { MemoriesService } from './core/services/memories.service';
import { MemoryPhoto } from './shared/models/supabase-memory.models';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly memories = inject(MemoriesService);

  readonly currentUser = this.auth.currentUser;
  readonly avatarUrl = this.auth.avatarUrl;

  readonly showAnniversary = signal(false);
  readonly anniversaryPhotos = signal<MemoryPhoto[]>([]);

  readonly navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/album', label: 'Album' },
    { path: '/timeline', label: 'Linea' },
    { path: '/capsula', label: 'Capsula' },
  ];

  ngOnInit(): void {
    if (this.isAnniversary()) {
      this.showAnniversary.set(true);
      void this.loadAnniversaryPhotos();
    }
  }

  isAnniversary(): boolean {
    // Forzado para previsualización (cambiar a lógica de fecha real después)
    return true; 
    // const today = new Date();
    // return today.getMonth() === 4 && today.getDate() === 4;
  }

  async loadAnniversaryPhotos(): Promise<void> {
    try {
      const photos = await this.memories.getAlbumPhotos();
      // Filtramos cualquier foto que mencione al bicho o CR7 en título o descripción
      const filtered = photos.filter(p => 
        !p.title.toLowerCase().includes('bicho') && 
        !p.description.toLowerCase().includes('bicho') &&
        !p.title.toLowerCase().includes('cr7')
      );
      this.anniversaryPhotos.set(filtered.slice(0, 4));
    } catch (err) {
      console.error('Error cargando fotos aniversario', err);
    }
  }

  celebrate(): void {
    this.createHearts();
    setTimeout(() => this.showAnniversary.set(false), 2000);
  }

  private createHearts(): void {
    const container = document.body;
    for (let i = 0; i < 30; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.innerHTML = '❤️';
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.animationDelay = Math.random() * 1 + 's';
      heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
      container.appendChild(heart);
      setTimeout(() => heart.remove(), 3000);
    }
  }

  showShell(): boolean {
    return this.auth.isLoggedIn() && !this.router.url.startsWith('/login');
  }

  profileName(): string {
    return this.auth.displayName();
  }

  profileInitials(): string {
    return this.profileName()
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
