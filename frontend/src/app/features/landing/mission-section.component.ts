import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { ORG_VALUES } from './data/values.data';

@Component({
  selector: 'app-mission-section',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  template: `
    <section class="relative overflow-hidden bg-marino-900 py-20 text-white">
      <div class="bg-dot-grid absolute inset-0 opacity-40"></div>
      <div class="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div appReveal class="relative mx-auto w-full max-w-md lg:mx-0">
            <div class="absolute -inset-4 rounded-[2rem] bg-naranja-500/20 blur-2xl" aria-hidden="true"></div>
            <img
              src="assets/qori-kallpa-logo.jpg"
              alt="Ilustración de meditación y conexión con la cosmovisión ancestral de Qori Kallpa"
              class="relative w-full rounded-[2rem] shadow-2xl ring-1 ring-white/10"
            />
          </div>

          <div appReveal [revealDelay]="100">
            <p class="text-sm font-bold uppercase tracking-widest text-naranja-400">Quiénes somos</p>
            <svg xmlns="http://www.w3.org/2000/svg" class="mt-4 h-8 w-8 text-naranja-400/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.17 6A5.17 5.17 0 002 11.17V18h6.83v-6.83H4.83A2.17 2.17 0 017 9v-1a2 2 0 002-2V6H7.17zm10 0A5.17 5.17 0 0012 11.17V18h6.83v-6.83H14.83A2.17 2.17 0 0117 9v-1a2 2 0 002-2v0h-1.83z" />
            </svg>
            <p class="mt-6 text-xl font-medium leading-relaxed text-marino-100 sm:text-2xl">
              Qori Kallpa (quechua: "Fuerza de Oro") es una Organización No Gubernamental sin fines de lucro, constituida
              por mujeres y hombres comprometidos con la promoción, preservación y revitalización de las culturas
              originarias de América Latina, con énfasis especial en el rescate, documentación, enseñanza y uso activo
              de las lenguas indígenas amenazadas.
            </p>
            <p class="mt-4 text-marino-300">
              Nuestra labor se fundamenta en los principios de reciprocidad (ayni), respeto intercultural, equidad de
              género, justicia social y la cosmovisión ancestral que nos enseña que la diversidad cultural es riqueza
              colectiva.
            </p>
          </div>
        </div>

        <div class="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          @for (value of values; track value.title; let i = $index) {
            <div appReveal [revealDelay]="i * 80" class="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:bg-white/10">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-naranja-500/20 text-naranja-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="value.icon" />
                </svg>
              </div>
              <h3 class="mt-4 text-sm font-bold text-white">{{ value.title }}</h3>
              <p class="mt-2 text-xs leading-relaxed text-marino-300">{{ value.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class MissionSectionComponent {
  readonly values = ORG_VALUES;
}
