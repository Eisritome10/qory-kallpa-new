import { Component, ElementRef, Input, OnDestroy, OnInit, inject, signal } from '@angular/core';

@Component({
  selector: 'app-stat-counter',
  standalone: true,
  template: `<span>{{ prefix }}{{ displayValue() }}{{ suffix }}</span>`,
})
export class StatCounterComponent implements OnInit, OnDestroy {
  @Input({ required: true }) target = 0;
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() durationMs = 1400;

  readonly displayValue = signal(0);

  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private frameId?: number;

  ngOnInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.displayValue.set(this.target);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.animate();
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }

  private animate(): void {
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / this.durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.displayValue.set(Math.round(eased * this.target));

      if (progress < 1) {
        this.frameId = requestAnimationFrame(step);
      }
    };

    this.frameId = requestAnimationFrame(step);
  }
}
