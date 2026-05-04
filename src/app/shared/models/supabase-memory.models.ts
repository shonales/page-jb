export interface MemoryPhoto {
  id: string;
  title: string;
  description: string;
  photoPath: string;
  photoUrl: string;
  photoDate: string | null;
  isFavorite: boolean;
  sortOrder: number;
}

export interface ProfileInfo {
  displayName: string;
  username: string;
  avatarPath: string | null;
  avatarUrl: string | null;
}
