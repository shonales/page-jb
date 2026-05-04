import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly enabled = Boolean(environment.supabaseUrl && environment.supabaseAnonKey);
  private readonly client: SupabaseClient | null = this.enabled
    ? createClient(environment.supabaseUrl, environment.supabaseAnonKey)
    : null;

  isConfigured(): boolean {
    return this.enabled;
  }

  getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase aun no esta configurado. Completa src/environments/environment.ts.');
    }

    return this.client;
  }
}
