import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApplicationsService } from '../../core/services/applications.service';
import {
  AREA_LABELS,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
  VolunteerApplication,
} from '../../core/models/application.model';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-marino-900">Mis postulaciones</h1>
          <p class="mt-1 text-marino-500">Sigue el estado de tus postulaciones como voluntario/a.</p>
        </div>
        <a routerLink="/postular" class="btn-primary">Nueva postulación</a>
      </div>

      @if (loading()) {
        <p class="text-marino-500">Cargando...</p>
      } @else if (applications().length === 0) {
        <div class="card text-center text-marino-500">Aún no tienes postulaciones registradas.</div>
      } @else {
        <div class="space-y-4">
          @for (application of applications(); track application.id) {
            <div class="card">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 class="text-lg font-bold text-marino-900">{{ areaLabel(application.area) }}</h2>
                  <p class="text-sm text-marino-500">Enviada el {{ application.createdAt | date: 'dd/MM/yyyy' }}</p>
                </div>
                <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1" [ngClass]="badgeClass(application)">
                  {{ statusLabel(application) }}
                </span>
              </div>

              @if (application.feedback) {
                <div class="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-marino-700">
                  <span class="font-semibold">Feedback del equipo:</span> {{ application.feedback }}
                </div>
              }
            </div>
          }
        </div>
      }
    </section>
  `,
})
export class MyApplicationsComponent implements OnInit {
  readonly applications = signal<VolunteerApplication[]>([]);
  readonly loading = signal(true);

  constructor(private readonly applicationsService: ApplicationsService) {}

  ngOnInit(): void {
    this.applicationsService.findMine().subscribe({
      next: (applications) => {
        this.applications.set(applications);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  areaLabel(area: VolunteerApplication['area']): string {
    return AREA_LABELS[area];
  }

  statusLabel(application: VolunteerApplication): string {
    return STATUS_LABELS[application.status];
  }

  badgeClass(application: VolunteerApplication): string {
    return STATUS_BADGE_CLASSES[application.status];
  }
}
