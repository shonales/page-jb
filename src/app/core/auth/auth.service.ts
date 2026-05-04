import { Injectable, inject, signal } from '@angular/core';
import { Session } from '@supabase/supabase-js';
import { MemoriesService } from '../services/memories.service';
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
  private readonly memories = inject(MemoriesService);
  private readonly ready: Promise<void>;

  readonly isLoggedIn = signal(false);
  readonly currentUser = signal<AppUser | null>(null);
  readonly displayName = signal('Page JB');
  readonly avatarUrl = signal<string | null>(null);

  constructor() {
    this.ready = this.loadSession();

    if (this.supabase.isConfigured()) {
      this.supabase.getClient().auth.onAuthStateChange((_event, session) => {
        void this.applySession(session);
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
      await this.applySession(null);
      return false;
    }

    await this.applySession(data.session);
    return true;
  }

  async logout(): Promise<void> {
    if (this.supabase.isConfigured()) {
      await this.supabase.getClient().auth.signOut();
    }

    await this.applySession(null);
  }

  async isAuthenticated(): Promise<boolean> {
    await this.ready;
    return this.isLoggedIn();
  }

  private async loadSession(): Promise<void> {
    if (!this.supabase.isConfigured()) {
    await this.applySession(null);
      return;
    }

    const { data } = await this.supabase.getClient().auth.getSession();
    await this.applySession(data.session);
  }

  private async applySession(session: Session | null): Promise<void> {
    const email = session?.user.email?.toLowerCase() ?? '';
    const user = Object.values(USER_EMAILS).find((entry) => entry.email === email)?.name ?? null;

    this.currentUser.set(user);
    this.isLoggedIn.set(Boolean(session && user));

    if (!session || !user) {
      this.displayName.set('Page JB');
      this.avatarUrl.set(null);
      return;
    }

    const profile = await this.memories.getCurrentProfile();
    this.displayName.set(profile?.displayName ?? user);
    this.avatarUrl.set(profile?.avatarUrl ?? null);
  }
}
