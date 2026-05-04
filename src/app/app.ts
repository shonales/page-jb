import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly currentUser = this.auth.currentUser;

  readonly navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/albun', label: 'Albun' },
    { path: '/timeline', label: 'Linea' },
    { path: '/cartas', label: 'Cartas' },
    { path: '/juegos', label: 'Juegos' },
    { path: '/capsula', label: 'Capsula' },
  ];

  showShell(): boolean {
    return this.auth.isLoggedIn() && !this.router.url.startsWith('/login');
  }

  profileName(): string {
    return this.currentUser() ?? 'Page JB';
  }

  profileInitials(): string {
    return this.profileName()
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
