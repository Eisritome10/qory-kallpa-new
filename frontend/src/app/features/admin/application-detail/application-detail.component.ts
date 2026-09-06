import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApplicationsService } from '../../../core/services/applications.service';
import {
  AREA_LABELS,
  ApplicationStatus,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
  VolunteerApplication,
} from '../../../core/models/application.model';

const NEXT_STATUS: Record<ApplicationStatus, ApplicationStatus[]> = {
  PENDIENTE: ['EN_REVISION'],
  EN_REVISION: ['ACEPTADO', 'RECHAZADO'],
  ACEPTADO: [],
  RECHAZADO: [],
};

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="/admin" class="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-marino-600 hover:text-naranja-600">
      &larr; Volver a postulaciones
    </a>

    @if (loading()) {
      <p class="text-marino-500">Cargando...</p>
    } @else {
    @if (application(); as app) {
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="card lg:col-span-2">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 class="text-2xl font-extrabold text-marino-900">{{ app.fullName }}</h1>
              <p class="text-marino-500">{{ app.email }} · {{ app.phone }}</p>
            </div>
            <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1" [ngClass]="statusBadge[app.status]">
              {{ statusLabels[app.status] }}
            </span>
          </div>

          <dl class="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt class="text-xs font-semibold uppercase text-marino-400">Área</dt>
              <dd class="text-marino-800">{{ areaLabels[app.area] }}</dd>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase text-marino-400">DNI / Documento</dt>
              <dd class="text-marino-800">{{ app.dni }}</dd>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase text-marino-400">Fecha de nacimiento</dt>
              <dd class="text-marino-800">{{ app.birthDate | date: 'dd/MM/yyyy' }}</dd>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase text-marino-400">Disponibilidad</dt>
              <dd class="text-marino-800">{{ app.availability }}</dd>
            </div>
          </dl>

          <div class="mt-6">
            <dt class="text-xs font-semibold uppercase text-marino-400">Motivación</dt>
            <dd class="mt-1 whitespace-pre-line text-marino-800">{{ app.motivation }}</dd>
          </div>

          <div class="mt-6">
            <dt class="mb-2 text-xs font-semibold uppercase text-marino-400">Curriculum Vitae</dt>
            @if (cvUrl()) {
              <a [href]="cvUrl()" target="_blank" rel="noopener" class="btn-secondary">Ver / descargar CV ({{ app.cvFileName }})</a>
            } @else {
              <button type="button" class="btn-secondary" (click)="loadCv(app.id)">Generar enlace del CV</button>
            }
          </div>

          @if (app.reviewedBy) {
            <div class="mt-6 rounded-lg bg-gray-50 px-4 py-3 text-sm text-marino-600">
              Revisado por <span class="font-semibold">{{ app.reviewedBy.fullName }}</span> el
              {{ app.reviewedAt | date: 'dd/MM/yyyy HH:mm' }}
            </div>
          }
        </div>

        <div class="card h-fit">
          <h2 class="text-lg font-bold text-marino-900">Cambiar estado</h2>

          @if (availableTransitions(app).length === 0) {
            <p class="mt-3 text-sm text-marino-500">Esta postulación se encuentra en un estado final.</p>
          } @else {
            <form class="mt-4 space-y-4" [formGroup]="statusForm" (ngSubmit)="onSubmitStatus(app.id)">
              <div>
                <label class="mb-1 block text-sm font-medium text-marino-800">Nuevo estado</label>
                <select formControlName="status" class="input-field">
                  <option value="" disabled>Selecciona un estado</option>
                  @for (status of availableTransitions(app); track status) {
                    <option [value]="status">{{ statusLabels[status] }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-marino-800">
                  Feedback @if (statusForm.value.status === 'RECHAZADO') { (obligatorio) }
                </label>
                <textarea formControlName="feedback" rows="4" class="input-field" placeholder="Comparte retroalimentación con el postulante"></textarea>
              </div>

              @if (statusError()) {
                <div class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{{ statusError() }}</div>
              }

              <button type="submit" class="btn-primary w-full" [disabled]="statusForm.invalid || savingStatus()">
                {{ savingStatus() ? 'Guardando...' : 'Actualizar estado' }}
              </button>
            </form>
          }
        </div>
      </div>
    }
    }
  `,
})
export class ApplicationDetailComponent implements OnInit {
  readonly application = signal<VolunteerApplication | null>(null);
  readonly loading = signal(true);
  readonly cvUrl = signal<string | null>(null);
  readonly savingStatus = signal(false);
  readonly statusError = signal<string | null>(null);

  readonly statusLabels = STATUS_LABELS;
  readonly areaLabels = AREA_LABELS;
  readonly statusBadge = STATUS_BADGE_CLASSES;

  private readonly fb = inject(FormBuilder);

  readonly statusForm = this.fb.nonNullable.group({
    status: ['', [Validators.required]],
    feedback: [''],
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly applicationsService: ApplicationsService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/admin']);
      return;
    }

    this.applicationsService.findOne(id).subscribe({
      next: (application) => {
        this.application.set(application);
        this.loading.set(false);
      },
      error: () => this.router.navigate(['/admin']),
    });
  }

  availableTransitions(app: VolunteerApplication): ApplicationStatus[] {
    return NEXT_STATUS[app.status];
  }

  loadCv(id: string): void {
    this.applicationsService.getCvSignedUrl(id).subscribe((response) => this.cvUrl.set(response.signedUrl));
  }

  onSubmitStatus(id: string): void {
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    const { status, feedback } = this.statusForm.getRawValue();

    if (status === 'RECHAZADO' && !feedback.trim()) {
      this.statusError.set('Debes indicar un feedback al rechazar una postulación.');
      return;
    }

    this.savingStatus.set(true);
    this.statusError.set(null);

    this.applicationsService
      .updateStatus(id, { status: status as ApplicationStatus, feedback: feedback || undefined })
      .subscribe({
        next: (updated) => {
          this.application.set(updated);
          this.savingStatus.set(false);
          this.statusForm.reset({ status: '', feedback: '' });
        },
        error: (error: HttpErrorResponse) => {
          this.savingStatus.set(false);
          this.statusError.set(error.error?.message ?? 'No se pudo actualizar el estado.');
        },
      });
  }
}
