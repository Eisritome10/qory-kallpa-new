import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { ALLIANCES } from './data/alliances.data';

@Component({
  selector: 'app-alliances-section',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  template: `
    <section class="border-y border-gray-100 bg-gray-50 py-14">
      <div appReveal class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p class="text-sm font-bold uppercase tracking-widest text-naranja-600">Alianzas</p>
        <h2 class="mt-2 text-2xl font-extrabold text-marino-900 sm:text-3xl">Organizaciones que caminan con nosotros</h2>
      </div>

      <div class="relative mt-10 overflow-hidden">
        <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-gray-50 to-transparent"></div>
        <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-gray-50 to-transparent"></div>

        <div class="marquee-track flex w-max gap-6">
          @for (alliance of doubledAlliances; track $index) {
            @if (alliance.url) {
              <a
                [href]="alliance.url"
                target="_blank"
                rel="noopener"
                class="flex h-20 w-56 flex-shrink-0 items-center justify-center rounded-xl bg-white px-6 text-center text-sm font-semibold text-marino-500 shadow-sm ring-1 ring-black/5 transition hover:text-naranja-600 hover:shadow-md"
              >
                {{ alliance.name }}
              </a>
            } @else {
              <div class="flex h-20 w-56 flex-shrink-0 items-center justify-center rounded-xl bg-white px-6 text-center text-sm font-semibold text-marino-500 shadow-sm ring-1 ring-black/5">
                {{ alliance.name }}
              </div>
            }
          }
        </div>
      </div>
    </section>
  `,
})
export class AlliancesSectionComponent {
  readonly doubledAlliances = [...ALLIANCES, ...ALLIANCES];
}
