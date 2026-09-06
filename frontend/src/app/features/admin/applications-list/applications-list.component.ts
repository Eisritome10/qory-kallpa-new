import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ApplicationsService } from '../../../core/services/applications.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  AREA_LABELS,
  ApplicationStatus,
  AreaVoluntariado,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
  VolunteerApplication,
} from '../../../core/models/application.model';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold text-marino-900">Postulaciones</h1>
        <p class="text-sm text-marino-500">
          @if (auth.currentUser()?.role === 'DIRECTOR_GENERAL') {
            Vista general de todas las áreas.
          } @else {
            Postulaciones del área {{ areaLabelForRole() }}.
          }
        </p>
      </div>
    </div>

    <form [formGroup]="filtersForm" class="mb-6 flex flex-wrap gap-3">
      <input type="text" formControlName="search" placeholder="Buscar por nombre, correo o DNI" class="input-field max-w-xs" />

      <select formControlName="status" class="input-field max-w-[180px]">
        <option value="">Todos los estados</option>
        @for (status of statuses; track status) {
          <option [value]="status">{{ statusLabels[status] }}</option>
        }
      </select>

      @if (auth.currentUser()?.role === 'DIRECTOR_GENERAL') {
        <select formControlName="area" class="input-field max-w-[180px]">
          <option value="">Todas las áreas</option>
          @for (area of areas; track area) {
            <option [value]="area">{{ areaLabels[area] }}</option>
          }
        </select>
      }
    </form>

    @if (loading()) {
      <p class="text-marino-500">Cargando postulaciones...</p>
    } @else if (applications().length === 0) {
      <div class="card text-center text-marino-500">No se encontraron postulaciones con estos filtros.</div>
    } @else {
      <div class="card overflow-x-auto !p-0">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-marino-700">Postulante</th>
              <th class="px-4 py-3 text-left font-semibold text-marino-700">Área</th>
              <th class="px-4 py-3 text-left font-semibold text-marino-700">Fecha</th>
              <th class="px-4 py-3 text-left font-semibold text-marino-700">Estado</th>
              <th class="px-4 py-3 text-right font-semibold text-marino-700">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (application of applications(); track application.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <p class="font-semibold text-marino-900">{{ application.fullName }}</p>
                  <p class="text-xs text-marino-500">{{ application.email }}</p>
                </td>
                <td class="px-4 py-3 text-marino-700">{{ areaLabels[application.area] }}</td>
                <td class="px-4 py-3 text-marino-700">{{ application.createdAt | date: 'dd/MM/yyyy' }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1" [ngClass]="statusBadge[application.status]">
                    {{ statusLabels[application.status] }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <a [routerLink]="['/admin/postulaciones', application.id]" class="text-sm font-semibold text-naranja-600 hover:underline">Ver detalle</a>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class ApplicationsListComponent implements OnInit {
  readonly applications = signal<VolunteerApplication[]>([]);
  readonly loading = signal(true);
  readonly statuses: ApplicationStatus[] = ['PENDIENTE', 'EN_REVISION', 'ACEPTADO', 'RECHAZADO'];
  readonly areas: AreaVoluntariado[] = [
    'ALIANZAS_RECAUDACION',
    'TECNOLOGIA_SISTEMAS',
    'SUPERVISION_PROYECTOS',
    'PROGRAMAS',
    'EVENTOS',
    'MARKETING',
    'GESTION_HUMANA',
  ];
  readonly statusLabels = STATUS_LABELS;
  readonly areaLabels = AREA_LABELS;
  readonly statusBadge = STATUS_BADGE_CLASSES;

  private readonly fb = inject(FormBuilder);

  readonly filtersForm = this.fb.nonNullable.group({
    search: [''],
    status: [''],
    area: [''],
  });

  constructor(
    private readonly applicationsService: ApplicationsService,
    public readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadApplications();

    this.filtersForm.valueChanges.pipe(debounceTime(300)).subscribe(() => this.loadApplications());
  }

  areaLabelForRole(): string {
    const map: Record<string, AreaVoluntariado> = {
      DIRECTOR_ALIANZAS_RECAUDACION: 'ALIANZAS_RECAUDACION',
      DIRECTOR_TECNOLOGIA_SISTEMAS: 'TECNOLOGIA_SISTEMAS',
      DIRECTOR_SUPERVISION_PROYECTOS: 'SUPERVISION_PROYECTOS',
      DIRECTOR_PROGRAMAS: 'PROGRAMAS',
      DIRECTOR_EVENTOS: 'EVENTOS',
      DIRECTOR_MARKETING: 'MARKETING',
      DIRECTOR_GESTION_HUMANA: 'GESTION_HUMANA',
    };
    const role = this.auth.currentUser()?.role ?? '';
    const area = map[role];
    return area ? AREA_LABELS[area] : '';
  }

  private loadApplications(): void {
    this.loading.set(true);
    const { search, status, area } = this.filtersForm.getRawValue();

    this.applicationsService
      .findAll({
        search: search || undefined,
        status: (status || undefined) as ApplicationStatus | undefined,
        area: (area || undefined) as AreaVoluntariado | undefined,
      })
      .subscribe({
        next: (applications) => {
          this.applications.set(applications);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
