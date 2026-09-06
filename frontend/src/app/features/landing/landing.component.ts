import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { StatCounterComponent } from '../../shared/components/stat-counter.component';
import { SusFeedbackWidgetComponent } from './sus-feedback-widget.component';
import { MissionSectionComponent } from './mission-section.component';
import { AuthService } from '../../core/services/auth.service';

interface Area {
  name: string;
  description: string;
  icon: string;
}

const AREAS: Area[] = [
  {
    name: 'Alianzas y Recaudación',
    description: 'Construimos alianzas estratégicas y gestionamos la recaudación de fondos.',
    icon: 'M12 4.5v15m7.5-7.5h-15M8.25 8.25l7.5 7.5m0-7.5l-7.5 7.5',
  },
  {
    name: 'Tecnología y Sistemas',
    description: 'Desarrollamos y mantenemos las herramientas digitales de la organización.',
    icon: 'M9.75 17L15 20l-.75-3.5M14.25 7L9 4l.75 3.5M4 9l3.5-.75L4 5m16 4l-3.5-.75L20 5M4 15l3.5.75L4 19m16-4l-3.5.75L20 19',
  },
  {
    name: 'Supervisión de Proyectos',
    description: 'Aseguramos la calidad y el impacto de cada proyecto en ejecución.',
    icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    name: 'Marketing',
    description: 'Comunicación, redes sociales y campañas para dar voz a nuestras causas.',
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  },
  {
    name: 'Eventos',
    description: 'Planificación y ejecución de actividades que movilizan a la comunidad.',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    name: 'Programas',
    description: 'Diseño y ejecución de programas sociales de impacto sostenible.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    name: 'Gestión Humana',
    description: 'Acompañamos a cada voluntario/a desde su postulación hasta su desarrollo.',
    icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4',
  },
];

const ROTATING_WORDS = ['lenguas originarias', 'culturas ancestrales', 'comunidades indígenas', 'saberes ancestrales'];

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RevealOnScrollDirective,
    StatCounterComponent,
    SusFeedbackWidgetComponent,
    MissionSectionComponent,
  ],
  template: `
    <!-- Hero -->
    <section class="relative overflow-hidden bg-marino-950">
      <div class="bg-dot-grid absolute inset-0"></div>
      <div
        class="pointer-events-none absolute inset-0 opacity-30"
        style="background: radial-gradient(circle at 15% 20%, #f8621a 0, transparent 42%), radial-gradient(circle at 85% 0%, #2c649f 0, transparent 45%);"
      ></div>
      <span
        class="pointer-events-none absolute -right-10 -top-10 select-none text-[16rem] font-extrabold leading-none text-white/[0.03] sm:text-[22rem]"
        aria-hidden="true"
        >QK</span
      >

      <div class="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
        <p appReveal class="text-sm font-bold uppercase tracking-widest text-naranja-400">Qori Kallpa &middot; Fuerza de Oro</p>
        <h1 appReveal [revealDelay]="80" class="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-6xl">
          Voces con Poder
        </h1>
        <p appReveal [revealDelay]="140" class="mt-5 flex flex-wrap items-baseline gap-x-2 text-xl font-semibold text-marino-200 sm:text-2xl">
          <span>Rescatamos</span>
          <span class="text-naranja-400">
            {{ typedText() }}<span class="typewriter-cursor h-6 align-middle sm:h-7"></span>
          </span>
        </p>
        <p appReveal [revealDelay]="200" class="mt-5 max-w-xl text-lg text-marino-300">
          Impulsamos el voluntariado y la acción social para revitalizar las culturas originarias de América Latina.
          Suma tu tiempo, tu talento o tu aporte a nuestra causa.
        </p>
        <div appReveal [revealDelay]="260" class="mt-8 flex flex-wrap gap-4">
          <a routerLink="/postular" class="btn-primary shadow-lg shadow-naranja-500/20">Postula como voluntario/a</a>
          <a href="#donar" class="btn-secondary !border-white/30 !text-white hover:!bg-white hover:!text-marino-900">Quiero donar</a>
        </div>

        <div appReveal [revealDelay]="320" class="mt-16 grid grid-cols-2 gap-6 border-t border-white/10 pt-10 sm:grid-cols-4">
          @for (stat of stats; track stat.label) {
            <div>
              <p class="text-3xl font-extrabold text-white sm:text-4xl">
                <app-stat-counter [target]="stat.value" [suffix]="stat.suffix" />
              </p>
              <p class="mt-1 text-sm text-marino-300">{{ stat.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Misión y principios -->
    <app-mission-section />

    <!-- Áreas -->
    <section class="bg-gray-50 py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div appReveal class="mx-auto max-w-2xl text-center">
          <p class="text-sm font-bold uppercase tracking-widest text-naranja-600">Áreas de voluntariado</p>
          <h2 class="mt-2 text-3xl font-extrabold text-marino-900 sm:text-4xl">Elige dónde poner tu energía</h2>
          <p class="mt-3 text-marino-500">Siete áreas funcionales trabajando juntas por nuestras comunidades.</p>
        </div>

        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (area of areas; track area.name; let i = $index) {
            <div appReveal [revealDelay]="i * 60" class="card flex flex-col items-start transition hover:-translate-y-1 hover:shadow-xl">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-naranja-50 text-naranja-600 transition group-hover:scale-110">
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
    <section id="donar" class="relative overflow-hidden bg-marino-800 py-20 text-white">
      <span class="pointer-events-none absolute -bottom-16 -left-16 select-none text-[14rem] font-extrabold leading-none text-white/[0.04]" aria-hidden="true">QK</span>
      <div class="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div appReveal>
          <p class="text-sm font-bold uppercase tracking-widest text-naranja-400">Donaciones</p>
          <h2 class="mt-2 text-3xl font-extrabold sm:text-4xl">Tu donación sostiene nuestros programas</h2>
          <p class="mt-4 text-marino-200">
            Con tu aporte financiamos materiales, movilidad y capacitación para las y los voluntarios que
            llevan adelante nuestros programas sociales.
          </p>
          <a href="mailto:donaciones@qorikallpa.org?subject=Quiero%20donar%20a%20Qori%20Kallpa" class="btn-primary mt-6 inline-flex">
            Escríbenos para donar
          </a>
        </div>
        <div appReveal [revealDelay]="120" class="card !bg-white/5 text-white ring-white/10">
          <h3 class="text-lg font-bold">¿Cómo se usan los fondos?</h3>
          <ul class="mt-4 space-y-3 text-sm text-marino-100">
            <li class="flex gap-2"><span class="text-naranja-400">&#9679;</span> Materiales para talleres comunitarios.</li>
            <li class="flex gap-2"><span class="text-naranja-400">&#9679;</span> Movilidad de voluntarios/as a zonas de intervención.</li>
            <li class="flex gap-2"><span class="text-naranja-400">&#9679;</span> Capacitación y certificación de voluntarios/as.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Encuesta de usabilidad -->
    <section class="bg-gray-50 py-20">
      <div appReveal class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        @if (isAuthenticated()) {
          <app-sus-feedback-widget />
        } @else {
          <div class="card text-center">
            <h3 class="text-lg font-bold text-marino-900">Ayúdanos a mejorar</h3>
            <p class="mt-2 text-sm text-marino-500">
              Inicia sesión o crea una cuenta para dejarnos tu opinión sobre la plataforma.
            </p>
            <div class="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <a routerLink="/ingresar" class="btn-primary">Iniciar sesión</a>
              <a routerLink="/registrarse" class="btn-secondary">Crear cuenta</a>
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class LandingComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly areas = AREAS;
  readonly stats = [
    { value: 500, suffix: '+', label: 'Voluntarios formados' },
    { value: 40, suffix: '+', label: 'Programas ejecutados' },
    { value: 15, suffix: '+', label: 'Comunidades beneficiadas' },
    { value: 7, suffix: '', label: 'Áreas de acción' },
  ];

  readonly typedText = signal('');

  private timeoutId?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.runTypewriter(0, 0, false);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  private runTypewriter(wordIndex: number, charIndex: number, deleting: boolean): void {
    const word = ROTATING_WORDS[wordIndex];
    this.typedText.set(word.slice(0, charIndex));

    if (!deleting && charIndex === word.length) {
      this.timeoutId = setTimeout(() => this.runTypewriter(wordIndex, charIndex, true), 1600);
      return;
    }

    if (deleting && charIndex === 0) {
      const nextWordIndex = (wordIndex + 1) % ROTATING_WORDS.length;
      this.timeoutId = setTimeout(() => this.runTypewriter(nextWordIndex, 0, false), 300);
      return;
    }

    const nextCharIndex = deleting ? charIndex - 1 : charIndex + 1;
    this.timeoutId = setTimeout(() => this.runTypewriter(wordIndex, nextCharIndex, deleting), deleting ? 35 : 60);
  }
}
