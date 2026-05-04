import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

type CatAction = 'play' | 'eat' | 'nap' | 'love' | 'stretch' | 'groom' | 'friend';
type CatMood = CatAction | 'peek' | 'hidden';

const CAT_ACTIONS: CatAction[] = ['play', 'eat', 'nap', 'love', 'stretch', 'groom', 'friend'];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private catTimer?: ReturnType<typeof setInterval>;

  email = signal('');
  accessCode = signal('');
  loginError = signal('');
  passwordFocused = signal(false);
  passwordVisible = signal(false);
  catAction = signal<CatAction>('love');
  catMood = computed<CatMood>(() => {
    if (this.passwordVisible()) {
      return 'hidden';
    }

    if (this.passwordFocused()) {
      return 'peek';
    }

    return this.catAction();
  });

  ngOnInit(): void {
    this.catTimer = setInterval(() => this.pickCatAction(), 7600);
  }

  ngOnDestroy(): void {
    clearInterval(this.catTimer);
  }

  enter(): void {
    const loggedIn = this.auth.login(this.email(), this.accessCode());

    if (!loggedIn) {
      this.loginError.set('Usuario o contrasena incorrectos.');
      return;
    }

    this.loginError.set('');
    this.router.navigateByUrl('/dashboard');
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  private pickCatAction(): void {
    const current = this.catAction();
    const options = CAT_ACTIONS.filter((action) => action !== current);
    const next = options[Math.floor(Math.random() * options.length)];
    this.catAction.set(next);
  }
}
