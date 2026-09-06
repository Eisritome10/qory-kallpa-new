import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SusFeedbackWidgetComponent } from './sus-feedback-widget.component';

interface Area {
  name: string;
  description: string;
  icon: string;
}

const AREAS: Area[] = [
  {
    name: 'Alianzas y Recaudacion',
    description: 'Construimos alianzas estrategicas y gestionamos la recaudacion de fondos.',
    icon: 'M12 4.5v15m7.5-7.5h-15M8.25 8.25l7.5 7.5m0-7.5l-7.5 7.5',
  },
  {
    name: 'Tecnologia y Sistemas',
    description: 'Desarrollamos y mantenemos las herramientas digitales de la organizacion.',
    icon: 'M9.75 17L15 20l-.75-3.5M14.25 7L9 4l.75 3.5M4 9l3.5-.75L4 5m16 4l-3.5-.75L20 5M4 15l3.5.75L4 19m16-4l-3.5.75L20 19',
  },
  {
    name: 'Supervision de Proyectos',
    description: 'Aseguramos la calidad y el impacto de cada proyecto en ejecucion.',
    icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    name: 'Marketing',
    description: 'Comunicacion, redes sociales y campanas para dar voz a nuestras causas.',
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  },
  {
    name: 'Eventos',
    description: 'Planificacion y ejecucion de actividades que movilizan a la comunidad.',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    name: 'Programas',
    description: 'Diseno y ejecucion de programas sociales de impacto sostenible.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    name: 'Gestion Humana',
    description: 'Acompanamos a cada voluntario/a desde su postulacion hasta su desarrollo.',
    icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4',
  },
];

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, SusFeedbackWidgetComponent],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden bg-marino-900">
      <div class="absolute inset-0 opacity-20" style="background: radial-gradient(circle at 20% 20%, #f8621a 0, transparent 40%), radial-gradient(circle at 80% 0%, #2c649f 0, transparent 40%);"></div>
      <div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <p class="text-sm font-bold uppercase tracking-widest text-naranja-400">Qori Kallpa</p>
        <h1 class="mt-3 max-w-2xl text-4xl font-extrabold text-white sm:text-5xl">Voces con Poder</h1>
        <p class="mt-5 max-w-xl text-lg text-marino-200">
          Impulsamos el voluntariado y la accion social para transformar comunidades. Suma tu tiempo,
          tu talento o tu aporte a nuestra causa.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <a routerLink="/postular" class="btn-primary">Postula como voluntario/a</a>
          <a href="#donar" class="btn-secondary !border-white !text-white hover:!bg-white hover:!text-marino-900">Quiero donar</a>
        </div>
      </div>
    </section>

    <!-- Impacto -->
    <section class="bg-white">
      <div class="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        @for (stat of stats; track stat.label) {
          <div class="text-center">
            <p class="text-3xl font-extrabold text-marino-800">{{ stat.value }}</p>
            <p class="mt-1 text-sm text-marino-500">{{ stat.label }}</p>
          </div>
        }
      </div>
    </section>

    <!-- Areas -->
    <section class="bg-gray-50 py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-extrabold text-marino-900">Areas de voluntariado</h2>
          <p class="mt-3 text-marino-500">Elige el area donde quieres poner tu energia al servicio de la comunidad.</p>
        </div>

        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (area of areas; track area.name) {
            <div class="card flex flex-col items-start">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-naranja-50 text-naranja-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="area.icon" />
                </svg>
              </div>
              <h3 class="mt-4 text-lg font-bold text-marino-900">{{ area.name }}</h3>
              <p class="mt-2 text-sm text-marino-500">{{ area.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Donaciones -->
    <section id="donar" class="bg-marino-800 py-16 text-white">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <h2 class="text-3xl font-extrabold">Tu donacion sostiene nuestros programas</h2>
          <p class="mt-4 text-marino-200">
            Con tu aporte financiamos materiales, movilidad y capacitacion para las y los voluntarios que
            llevan adelante nuestros programas sociales.
          </p>
          <a href="mailto:donaciones@qorikallpa.org?subject=Quiero%20donar%20a%20Qori%20Kallpa" class="btn-primary mt-6 inline-flex">
            Escribenos para donar
          </a>
        </div>
        <div class="card !bg-white/5 text-white ring-white/10">
          <h3 class="text-lg font-bold">¿Como se usan los fondos?</h3>
          <ul class="mt-4 space-y-3 text-sm text-marino-100">
            <li class="flex gap-2"><span class="text-naranja-400">●</span> Materiales para talleres comunitarios.</li>
            <li class="flex gap-2"><span class="text-naranja-400">●</span> Movilidad de voluntarios/as a zonas de intervencion.</li>
            <li class="flex gap-2"><span class="text-naranja-400">●</span> Capacitacion y certificacion de voluntarios/as.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Encuesta de usabilidad -->
    <section class="bg-gray-50 py-16">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <app-sus-feedback-widget />
      </div>
    </section>
  `,
})
export class LandingComponent {
  readonly areas = AREAS;
  readonly stats = [
    { value: '+500', label: 'Voluntarios formados' },
    { value: '+40', label: 'Programas ejecutados' },
    { value: '+15', label: 'Comunidades beneficiadas' },
    { value: '7', label: 'Areas de accion' },
  ];
}
