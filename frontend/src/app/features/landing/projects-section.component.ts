import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { PROJECTS } from './data/projects.data';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  template: `
    <section class="bg-gray-50 py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div appReveal class="mx-auto max-w-2xl text-center">
          <p class="text-sm font-bold uppercase tracking-widest text-naranja-600">Nuestros proyectos</p>
          <h2 class="mt-2 text-3xl font-extrabold text-marino-900 sm:text-4xl">Iniciativas que transforman comunidades</h2>
        </div>

        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (project of projects; track project.name; let i = $index) {
            <article appReveal [revealDelay]="i * 80" class="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl">
              <div class="flex h-36 items-center justify-center bg-gradient-to-br text-white" [ngClass]="project.gradient">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="p-5">
                <span class="inline-flex items-center rounded-full bg-marino-50 px-3 py-1 text-xs font-semibold text-marino-700">{{ project.area }}</span>
                <h3 class="mt-3 text-lg font-bold text-marino-900">{{ project.name }}</h3>
                <p class="mt-2 text-sm text-marino-500">{{ project.description }}</p>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class ProjectsSectionComponent {
  readonly projects = PROJECTS;
}
