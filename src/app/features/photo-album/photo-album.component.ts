import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MemoriesService } from '../../core/services/memories.service';
import { MemoryPhoto } from '../../shared/models/supabase-memory.models';

@Component({
  selector: 'app-photo-album',
  standalone: true,
  templateUrl: './photo-album.component.html',
  styleUrl: './photo-album.component.scss',
})
export class PhotoAlbumComponent implements OnInit {
  private readonly memories = inject(MemoriesService);

  photos = signal<MemoryPhoto[]>([]);
  currentIndex = signal(0);
  pageMotion = signal('');
  lightboxOpen = signal(false);
  viewMode = signal<'grid' | 'single'>('grid');
  isExpanded = signal(false);
  loading = signal(true);
  loadError = signal('');

  currentPhoto = computed(() => this.photos()[this.currentIndex()]);
  totalPages = computed(() => this.photos().length);

  ngOnInit(): void {
    void this.loadPhotos();
  }

  async loadPhotos(): Promise<void> {
    this.loading.set(true);
    this.loadError.set('');

    try {
      const photos = await this.memories.getAlbumPhotos();
      this.photos.set(photos);
      this.currentIndex.set(0);
    } catch {
      this.loadError.set('No se pudieron cargar las fotos.');
    } finally {
      this.loading.set(false);
    }
  }

  nextPage(): void {
    if (this.currentIndex() >= this.totalPages() - 1) {
      return;
    }

    this.turnPage(1);
  }

  previousPage(): void {
    if (this.currentIndex() <= 0) {
      return;
    }

    this.turnPage(-1);
  }

  openSingle(index: number): void {
    this.currentIndex.set(index);
    this.viewMode.set('single');
    this.pageMotion.set('page-enter');
    setTimeout(() => this.pageMotion.set(''), 460);
  }

  formatDate(date: string | null): string {
    if (!date) {
      return '';
    }

    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));
  }

  private turnPage(direction: 1 | -1): void {
    this.pageMotion.set(direction === 1 ? 'page-exit-next' : 'page-exit-prev');

    setTimeout(() => {
      this.currentIndex.update((index) => index + direction);
      this.pageMotion.set(direction === 1 ? 'page-enter-next' : 'page-enter-prev');
    }, 360);

    setTimeout(() => this.pageMotion.set(''), 820);
  }
}
