import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ApplicationsService } from '../../../core/services/applications.service';
import { SusEvaluationService } from '../../../core/services/sus-evaluation.service';
import { ApplicationMetrics } from '../../../core/models/application.model';
import { SusStats } from '../../../core/models/sus-evaluation.model';

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="text-2xl font-extrabold text-marino-900">Metricas e indicadores</h1>
    <p class="mt-1 text-sm text-marino-500">Panel de conversion de postulaciones y usabilidad de la plataforma.</p>

    @if (loading()) {
      <p class="mt-6 text-marino-500">Cargando metricas...</p>
    } @else {
      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="card">
          <p class="text-xs font-semibold uppercase text-marino-400">Total de postulaciones</p>
          <p class="mt-2 text-3xl font-extrabold text-marino-900">{{ metrics()?.total ?? 0 }}</p>
        </div>
        <div class="card">
          <p class="text-xs font-semibold uppercase text-marino-400">Pendientes</p>
          <p class="mt-2 text-3xl font-extrabold text-marino-900">{{ metrics()?.pendientes ?? 0 }}</p>
        </div>
        <div class="card">
          <p class="text-xs font-semibold uppercase text-marino-400">En revision</p>
          <p class="mt-2 text-3xl font-extrabold text-marino-900">{{ metrics()?.enRevision ?? 0 }}</p>
        </div>
        <div class="card">
          <p class="text-xs font-semibold uppercase text-marino-400">Aceptadas</p>
          <p class="mt-2 text-3xl font-extrabold text-emerald-600">{{ metrics()?.aceptadas ?? 0 }}</p>
        </div>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <div class="card">
          <p class="text-xs font-semibold uppercase text-marino-400">Tasa de conversion (aceptadas / total)</p>
          <p class="mt-2 text-3xl font-extrabold text-naranja-600">{{ metrics()?.tasaConversion ?? 0 }}%</p>
          <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div class="h-full rounded-full bg-naranja-500" [style.width.%]="metrics()?.tasaConversion ?? 0"></div>
          </div>
        </div>
        <div class="card">
          <p class="text-xs font-semibold uppercase text-marino-400">Tasa de aceptacion sobre resueltas</p>
          <p class="mt-2 text-3xl font-extrabold text-marino-800">{{ metrics()?.tasaAceptacionSobreResueltas ?? 0 }}%</p>
          <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div class="h-full rounded-full bg-marino-700" [style.width.%]="metrics()?.tasaAceptacionSobreResueltas ?? 0"></div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-lg font-bold text-marino-900">Usabilidad de la plataforma (SUS)</h2>
        <div class="mt-4 card sm:max-w-md">
          @if (susStats() && susStats()!.count > 0) {
            <p class="text-xs font-semibold uppercase text-marino-400">Puntaje promedio SUS</p>
            <p class="mt-2 text-3xl font-extrabold text-marino-900">{{ susStats()!.averageScore }} / 100</p>
            <p class="mt-1 text-sm text-marino-500">{{ susStats()!.interpretation }} · {{ susStats()!.count }} respuestas</p>
          } @else {
            <p class="text-sm text-marino-500">Aun no hay evaluaciones de usabilidad registradas.</p>
          }
        </div>
      </div>
    }
  `,
})
export class MetricsComponent implements OnInit {
  readonly metrics = signal<ApplicationMetrics | null>(null);
  readonly susStats = signal<SusStats | null>(null);
  readonly loading = signal(true);

  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly susEvaluationService: SusEvaluationService,
  ) {}

  ngOnInit(): void {
    this.applicationsService.getMetrics().subscribe((metrics) => this.metrics.set(metrics));
    this.susEvaluationService.getStats().subscribe({
      next: (stats) => {
        this.susStats.set(stats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
