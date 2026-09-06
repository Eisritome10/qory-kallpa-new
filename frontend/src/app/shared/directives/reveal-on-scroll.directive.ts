import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Agrega la clase "is-visible" cuando el elemento entra en el viewport.
 * El estado inicial (oculto/desplazado) se define en CSS mediante [appReveal].
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: { '[class.is-visible]': 'visible' },
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;

  visible = false;

  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.visible = true;
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTimeout(() => (this.visible = true), this.revealDelay);
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
