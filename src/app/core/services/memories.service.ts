import { Injectable, inject } from '@angular/core';
import { MemoryPhoto, ProfileInfo } from '../../shared/models/supabase-memory.models';
import { SupabaseService } from './supabase.service';

interface AlbumPhotoRow {
  id: string;
  title: string | null;
  description: string | null;
  photo_path: string;
  photo_date: string | null;
  is_favorite: boolean;
  sort_order: number;
}

interface ProfileRow {
  display_name: string;
  username: string;
  avatar_url: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MemoriesService {
  private readonly supabase = inject(SupabaseService);
  private readonly signedUrlSeconds = 60 * 60;
  private readonly urlCache = new Map<string, { url: string; expiry: number }>();

  async getAlbumPhotos(): Promise<MemoryPhoto[]> {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('album_photos')
      .select('id,title,description,photo_path,photo_date,is_favorite,sort_order')
      .order('photo_date', { ascending: false, nullsFirst: false })
      .order('sort_order', { ascending: false });

    if (error) {
      throw error;
    }

    const rows = (data ?? []) as AlbumPhotoRow[];
    
    // Optimizamos obteniendo las URLs. 
    return rows.map((row) => {
      const photoUrl = this.getPhotoUrl('album', row.photo_path);
      return {
        id: row.id,
        title: row.title ?? 'Recuerdo',
        description: row.description ?? '',
        photoPath: row.photo_path,
        photoUrl: photoUrl,
        photoDate: row.photo_date,
        isFavorite: row.is_favorite,
        sortOrder: row.sort_order,
      };
    });
  }

  private getPhotoUrl(bucket: string, path: string): string {
    // getPublicUrl es instantáneo y no requiere esperar una promesa (async/await)
    // Esto acelera mucho la carga inicial.
    const { data } = this.supabase.getClient().storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async getCurrentProfile(): Promise<ProfileInfo | null> {
    const client = this.supabase.getClient();
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await client
      .from('profiles')
      .select('display_name,username,avatar_url')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      return null;
    }

    const profile = data as ProfileRow;

    return {
      displayName: profile.display_name,
      username: profile.username,
      avatarPath: profile.avatar_url,
      avatarUrl: profile.avatar_url ? this.getPhotoUrl('avatars', profile.avatar_url) : null,
    };
  }

  // Mantenemos createSignedUrl por si se necesita para buckets privados en el futuro
  private async createSignedUrl(bucket: string, path: string): Promise<string> {
    const cacheKey = `${bucket}:${path}`;
    const cached = this.urlCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return cached.url;
    }

    const { data, error } = await this.supabase.getClient().storage.from(bucket).createSignedUrl(path, this.signedUrlSeconds);

    if (error || !data?.signedUrl) {
      throw error ?? new Error(`No se pudo firmar ${bucket}/${path}.`);
    }

    this.urlCache.set(cacheKey, {
      url: data.signedUrl,
      expiry: Date.now() + (this.signedUrlSeconds - 60) * 1000
    });

    return data.signedUrl;
  }

  async uploadPhoto(file: File, metadata: { title: string; description: string; date: string }): Promise<void> {
    const client = this.supabase.getClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `user-uploads/${fileName}`;

    // 1. Upload to storage
    const { error: uploadError } = await client.storage.from('album').upload(filePath, file);
    if (uploadError) throw uploadError;

    // 2. Insert into database
    const { error: dbError } = await client.from('album_photos').insert({
      title: metadata.title,
      description: metadata.description,
      photo_path: filePath,
      photo_date: metadata.date,
      sort_order: 0,
    });

    if (dbError) throw dbError;
  }
}
