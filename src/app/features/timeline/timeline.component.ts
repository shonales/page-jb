import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { starterTimeline } from '../../shared/data/couple.data';

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  items = starterTimeline;

  ngAfterViewInit(): void {
    const host = this.elementRef.nativeElement as HTMLElement;
    const cards: NodeListOf<HTMLElement> = host.querySelectorAll('.timeline-item');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      },
      { threshold: 0.28 },
    );

    cards.forEach((card) => this.observer?.observe(card));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
