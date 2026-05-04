import { Injectable, inject, signal } from '@angular/core';
import { Session } from '@supabase/supabase-js';
import { SupabaseService } from '../services/supabase.service';

export type AppUser = 'Jhon' | 'Behetsave';

const USER_EMAILS: Record<string, { email: string; name: AppUser }> = {
  JHON: { email: 'jhon@page-jb.local', name: 'Jhon' },
  BEHETSAVE: { email: 'behetsave@page-jb.local', name: 'Behetsave' },
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly ready: Promise<void>;

  readonly isLoggedIn = signal(false);
  readonly currentUser = signal<AppUser | null>(null);

  constructor() {
    this.ready = this.loadSession();

    if (this.supabase.isConfigured()) {
      this.supabase.getClient().auth.onAuthStateChange((_event, session) => {
        this.applySession(session);
      });
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    await this.ready;

    const normalizedUser = username.trim().toUpperCase();
    const mappedUser = USER_EMAILS[normalizedUser];

    if (!mappedUser || !password.trim() || !this.supabase.isConfigured()) {
      return false;
    }

    const { data, error } = await this.supabase.getClient().auth.signInWithPassword({
      email: mappedUser.email,
      password: password.trim(),
    });

    if (error || !data.session) {
      this.applySession(null);
      return false;
    }

    this.applySession(data.session);
    return true;
  }

  async logout(): Promise<void> {
    if (this.supabase.isConfigured()) {
      await this.supabase.getClient().auth.signOut();
    }

    this.applySession(null);
  }

  async isAuthenticated(): Promise<boolean> {
    await this.ready;
    return this.isLoggedIn();
  }

  private async loadSession(): Promise<void> {
    if (!this.supabase.isConfigured()) {
      this.applySession(null);
      return;
    }

    const { data } = await this.supabase.getClient().auth.getSession();
    this.applySession(data.session);
  }

  private applySession(session: Session | null): void {
    const email = session?.user.email?.toLowerCase() ?? '';
    const user = Object.values(USER_EMAILS).find((entry) => entry.email === email)?.name ?? null;

    this.currentUser.set(user);
    this.isLoggedIn.set(Boolean(session && user));
  }
}
