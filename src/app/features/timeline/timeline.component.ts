import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { MemoriesService } from '../../core/services/memories.service';
import { MemoryPhoto } from '../../shared/models/supabase-memory.models';

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly memories = inject(MemoriesService);
  private observer?: IntersectionObserver;

  items = signal<MemoryPhoto[]>([]);
  loading = signal(true);
  loadError = signal('');

  ngOnInit(): void {
    void this.loadItems();
  }

  ngAfterViewInit(): void {
    this.observeCards();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  async loadItems(): Promise<void> {
    this.loading.set(true);
    this.loadError.set('');

    try {
      const photos = await this.memories.getAlbumPhotos();
      this.items.set(
        photos
          .filter((photo) => photo.photoDate)
          .sort((a, b) => String(a.photoDate).localeCompare(String(b.photoDate))),
      );
      setTimeout(() => this.observeCards());
    } catch {
      this.loadError.set('No se pudo cargar la linea de tiempo.');
    } finally {
      this.loading.set(false);
    }
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

  private observeCards(): void {
    this.observer?.disconnect();

    const host = this.elementRef.nativeElement as HTMLElement;
    const cards: NodeListOf<HTMLElement> = host.querySelectorAll('.timeline-item');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      },
      { threshold: 0.22 },
    );

    cards.forEach((card) => this.observer?.observe(card));
  }
}
