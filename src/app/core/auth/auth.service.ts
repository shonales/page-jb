import { Injectable, signal } from '@angular/core';

const SESSION_KEY = 'page_jb_session';
const USER_KEY = 'page_jb_user';

export type AppUser = 'Jhon' | 'Behetsave';

const USERS: Record<string, { password: string; name: AppUser }> = {
  JHON: { password: '040525', name: 'Jhon' },
  BEHETSAVE: { password: '040525', name: 'Behetsave' },
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isLoggedIn = signal(this.hasActiveSession());
  readonly currentUser = signal<AppUser | null>(this.getStoredUser());

  login(username: string, password: string): boolean {
    const normalizedUser = username.trim().toUpperCase();
    const user = USERS[normalizedUser];

    if (!user || user.password !== password.trim()) {
      return false;
    }

    this.storage()?.setItem(SESSION_KEY, 'active');
    this.storage()?.setItem(USER_KEY, user.name);
    this.currentUser.set(user.name);
    this.isLoggedIn.set(true);
    return true;
  }

  logout(): void {
    this.storage()?.removeItem(SESSION_KEY);
    this.storage()?.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  private hasActiveSession(): boolean {
    return this.storage()?.getItem(SESSION_KEY) === 'active' && this.getStoredUser() !== null;
  }

  private getStoredUser(): AppUser | null {
    const user = this.storage()?.getItem(USER_KEY);
    return user === 'Jhon' || user === 'Behetsave' ? user : null;
  }

  private storage(): Storage | null {
    const storage = globalThis.localStorage;
    return typeof storage?.getItem === 'function' ? storage : null;
  }
}
