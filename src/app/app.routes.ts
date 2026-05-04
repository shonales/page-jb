import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { GamesComponent } from './features/games/games.component';
import { LettersComponent } from './features/letters/letters.component';
import { LoginComponent } from './features/login/login.component';
import { MemoryVaultComponent } from './features/memory-vault/memory-vault.component';
import { PhotoAlbumComponent } from './features/photo-album/photo-album.component';
import { TimelineComponent } from './features/timeline/timeline.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'album', component: PhotoAlbumComponent, canActivate: [authGuard] },
  { path: 'timeline', component: TimelineComponent, canActivate: [authGuard] },
  { path: 'cartas', component: LettersComponent, canActivate: [authGuard] },
  { path: 'juegos', component: GamesComponent, canActivate: [authGuard] },
  { path: 'capsula', component: MemoryVaultComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
