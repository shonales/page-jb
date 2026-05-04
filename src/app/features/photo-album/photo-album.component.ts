import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { starterPhotos } from '../../shared/data/couple.data';
import { LocalPhoto } from '../../shared/models/memory.models';

@Component({
  selector: 'app-photo-album',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './photo-album.component.html',
  styleUrl: './photo-album.component.scss',
})
export class PhotoAlbumComponent {
  photos = signal<LocalPhoto[]>(starterPhotos);
  title = signal('');
  caption = signal('');
  currentIndex = signal(0);
  pageMotion = signal('');
  showUploader = signal(false);
  lightboxOpen = signal(false);
  viewMode = signal<'grid' | 'single'>('grid');

  currentPhoto = computed(() => this.photos()[this.currentIndex()]);
  totalPages = computed(() => this.photos().length);

  addPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const photo: LocalPhoto = {
        id: Date.now(),
        title: this.title().trim() || file.name.replace(/\.[^/.]+$/, ''),
        caption: this.caption().trim() || 'Nuevo recuerdo agregado desde tu computadora.',
        src: String(reader.result),
        date: new Date().toISOString().slice(0, 10),
      };

      this.photos.update((items) => [photo, ...items]);
      this.currentIndex.set(0);
      this.pageMotion.set('page-enter');
      this.showUploader.set(false);
      this.title.set('');
      this.caption.set('');
      input.value = '';
      setTimeout(() => this.pageMotion.set(''), 460);
    };
    reader.readAsDataURL(file);
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

  private turnPage(direction: 1 | -1): void {
    this.pageMotion.set(direction === 1 ? 'page-exit-next' : 'page-exit-prev');

    setTimeout(() => {
      this.currentIndex.update((index) => index + direction);
      this.pageMotion.set(direction === 1 ? 'page-enter-next' : 'page-enter-prev');
    }, 360);

    setTimeout(() => this.pageMotion.set(''), 820);
  }
}
