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
      this.anniversaryPhotos.set(photos.slice(0, 4));
    } catch (err) {
      console.error('Error cargando fotos aniversario', err);
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
