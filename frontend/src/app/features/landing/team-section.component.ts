import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { AREA_DIRECTORS, FOUNDERS, TeamMember } from './data/team.data';

@Component({
  selector: 'app-team-section',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  template: `
    <section class="bg-white py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div appReveal class="mx-auto max-w-2xl text-center">
          <p class="text-sm font-bold uppercase tracking-widest text-naranja-600">Nuestro equipo</p>
          <h2 class="mt-2 text-3xl font-extrabold text-marino-900 sm:text-4xl">Las personas detras de Qori Kallpa</h2>
          <p class="mt-3 text-marino-500">
            Pasa el cursor o toca una tarjeta para conocer mas.
          </p>
        </div>

        <!-- Fundacion / Direccion General -->
        <div appReveal class="mt-16">
          <h3 class="text-lg font-bold text-marino-900">Fundacion y Direccion General</h3>
          <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            @for (member of founders; track member.id; let i = $index) {
              <ng-container *ngTemplateOutlet="memberCard; context: { member, i }" />
            }
          </div>
        </div>

        <!-- Direcciones de area -->
        <div appReveal class="mt-16">
          <h3 class="text-lg font-bold text-marino-900">Direcciones de Area</h3>
          <div class="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            @for (member of areaDirectors; track member.id; let i = $index) {
              <ng-container *ngTemplateOutlet="memberCard; context: { member, i }" />
            }
          </div>
        </div>
      </div>
    </section>

    <ng-template #memberCard let-member="member" let-i="i">
      <button
        type="button"
        appReveal
        [revealDelay]="i * 60"
        class="group relative aspect-[3/4] overflow-hidden rounded-2xl text-left shadow-md ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
        (click)="openMember(member)"
      >
        <div class="flex h-full flex-col items-center justify-center gap-3 p-4 text-white" [ngClass]="member.colorClass">
          <span class="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-xl font-extrabold ring-2 ring-white/40 sm:h-20 sm:w-20 sm:text-2xl">
            {{ member.initials }}
          </span>
          <div class="text-center">
            <p class="text-sm font-bold sm:text-base">{{ member.name }}</p>
            <p class="mt-1 text-xs font-medium text-white/80 sm:text-sm">{{ member.role }}</p>
          </div>
        </div>

        <div
          class="absolute inset-0 flex flex-col justify-end bg-marino-950/90 p-4 opacity-0 transition duration-300 group-hover:opacity-100 sm:p-5"
        >
          <p class="text-xs leading-relaxed text-white/90 sm:text-sm">{{ member.bio }}</p>
          <span class="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-naranja-400">
            Ver mas
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </button>
    </ng-template>

    @if (selected(); as member) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-marino-950/70 p-4" (click)="close()">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" (click)="$event.stopPropagation()">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <span class="flex h-14 w-14 items-center justify-center rounded-full text-lg font-extrabold text-white" [ngClass]="member.colorClass">
                {{ member.initials }}
              </span>
              <div>
                <p class="text-lg font-bold text-marino-900">{{ member.name }}</p>
                <p class="text-sm font-semibold text-naranja-600">{{ member.role }}</p>
              </div>
            </div>
            <button type="button" class="rounded-full p-1 text-marino-400 hover:bg-gray-100 hover:text-marino-700" (click)="close()" aria-label="Cerrar">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p class="mt-4 text-sm leading-relaxed text-marino-600">{{ member.bio }}</p>
        </div>
      </div>
    }
  `,
})
export class TeamSectionComponent {
  readonly founders: TeamMember[] = FOUNDERS;
  readonly areaDirectors: TeamMember[] = AREA_DIRECTORS;
  readonly selected = signal<TeamMember | null>(null);

  openMember(member: TeamMember): void {
    this.selected.set(member);
  }

  close(): void {
    this.selected.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
