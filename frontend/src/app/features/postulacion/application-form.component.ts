import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationsService } from '../../core/services/applications.service';
import { AreaVoluntariado } from '../../core/models/application.model';

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

const AREA_OPTIONS: { value: AreaVoluntariado; label: string }[] = [
  { value: 'ALIANZAS_RECAUDACION', label: 'Alianzas y Recaudacion' },
  { value: 'TECNOLOGIA_SISTEMAS', label: 'Tecnologia y Sistemas' },
  { value: 'SUPERVISION_PROYECTOS', label: 'Supervision de Proyectos' },
  { value: 'PROGRAMAS', label: 'Programas' },
  { value: 'EVENTOS', label: 'Eventos' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'GESTION_HUMANA', label: 'Gestion Humana' },
];

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-extrabold text-marino-900">Postula como voluntario/a</h1>
        <p class="mt-2 text-marino-500">Completa tus datos y adjunta tu CV en formato PDF.</p>
      </div>

      @if (success()) {
        <div class="card text-center">
          <p class="text-lg font-bold text-marino-900">¡Postulacion enviada con exito!</p>
          <p class="mt-2 text-sm text-marino-500">
            Revisaremos tu informacion y te contactaremos por correo. Puedes seguir el estado desde
            "Mis postulaciones".
          </p>
        </div>
      } @else {
        <form class="card space-y-5" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">Nombre completo</label>
              <input type="text" formControlName="fullName" class="input-field" [class.input-error]="isInvalid('fullName')" />
              @if (isInvalid('fullName')) {
                <p class="field-error">Ingresa tu nombre completo.</p>
              }
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">Correo electronico</label>
              <input type="email" formControlName="email" class="input-field" [class.input-error]="isInvalid('email')" />
              @if (isInvalid('email')) {
                <p class="field-error">Ingresa un correo valido.</p>
              }
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">Telefono</label>
              <input type="tel" formControlName="phone" class="input-field" [class.input-error]="isInvalid('phone')" placeholder="+51 999 999 999" />
              @if (isInvalid('phone')) {
                <p class="field-error">Ingresa un telefono valido.</p>
              }
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">DNI / Documento</label>
              <input type="text" formControlName="dni" class="input-field" [class.input-error]="isInvalid('dni')" />
              @if (isInvalid('dni')) {
                <p class="field-error">Ingresa un documento valido.</p>
              }
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">Fecha de nacimiento</label>
              <input type="date" formControlName="birthDate" class="input-field" [class.input-error]="isInvalid('birthDate')" />
              @if (isInvalid('birthDate')) {
                <p class="field-error">Ingresa tu fecha de nacimiento.</p>
              }
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">Area de interes</label>
              <select formControlName="area" class="input-field" [class.input-error]="isInvalid('area')">
                <option value="" disabled>Selecciona un area</option>
                @for (option of areaOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
              @if (isInvalid('area')) {
                <p class="field-error">Selecciona un area de voluntariado.</p>
              }
            </div>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-marino-800">Disponibilidad</label>
            <input type="text" formControlName="availability" class="input-field" [class.input-error]="isInvalid('availability')" placeholder="Ej: Fines de semana, 4 horas semanales" />
            @if (isInvalid('availability')) {
              <p class="field-error">Cuentanos tu disponibilidad.</p>
            }
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-marino-800">¿Por que quieres ser voluntario/a?</label>
            <textarea formControlName="motivation" rows="4" class="input-field" [class.input-error]="isInvalid('motivation')"></textarea>
            @if (isInvalid('motivation')) {
              <p class="field-error">Cuentanos tu motivacion (minimo 20 caracteres).</p>
            }
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-marino-800">CV (PDF, maximo 5MB)</label>
            <input type="file" accept="application/pdf" (change)="onFileSelected($event)" class="input-field file:mr-4 file:rounded-md file:border-0 file:bg-marino-100 file:px-3 file:py-1.5 file:text-marino-800" />
            @if (fileError()) {
              <p class="field-error">{{ fileError() }}</p>
            }
            @if (selectedFile(); as file) {
              <p class="mt-1 text-sm text-marino-500">Archivo seleccionado: {{ file.name }}</p>
            }
          </div>

          @if (errorMessage()) {
            <div class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage() }}</div>
          }

          <button type="submit" class="btn-primary w-full" [disabled]="form.invalid || !selectedFile() || loading()">
            {{ loading() ? 'Enviando postulacion...' : 'Enviar postulacion' }}
          </button>
        </form>
      }
    </section>
  `,
})
export class ApplicationFormComponent {
  readonly areaOptions = AREA_OPTIONS;
  readonly loading = signal(false);
  readonly success = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly fileError = signal<string | null>(null);
  readonly selectedFile = signal<File | null>(null);

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{6,15}$/)]],
    dni: ['', [Validators.required, Validators.pattern(/^[0-9A-Za-z]{6,12}$/)]],
    birthDate: ['', [Validators.required]],
    area: ['', [Validators.required]],
    availability: ['', [Validators.required, Validators.minLength(3)]],
    motivation: ['', [Validators.required, Validators.minLength(20)]],
  });

  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly router: Router,
  ) {}

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.fileError.set(null);

    if (!file) {
      this.selectedFile.set(null);
      return;
    }

    if (file.type !== 'application/pdf') {
      this.fileError.set('El archivo debe estar en formato PDF.');
      this.selectedFile.set(null);
      input.value = '';
      return;
    }

    if (file.size > MAX_CV_SIZE_BYTES) {
      this.fileError.set('El archivo no debe superar los 5MB.');
      this.selectedFile.set(null);
      input.value = '';
      return;
    }

    this.selectedFile.set(file);
  }

  onSubmit(): void {
    const file = this.selectedFile();

    if (this.form.invalid || !file) {
      this.form.markAllAsTouched();
      if (!file) this.fileError.set('Debes adjuntar tu CV en formato PDF.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const formValue = this.form.getRawValue();
    const formData = new FormData();
    formData.append('fullName', formValue.fullName);
    formData.append('email', formValue.email);
    formData.append('phone', formValue.phone);
    formData.append('dni', formValue.dni);
    formData.append('birthDate', new Date(formValue.birthDate).toISOString());
    formData.append('area', formValue.area);
    formData.append('availability', formValue.availability);
    formData.append('motivation', formValue.motivation);
    formData.append('cv', file);

    this.applicationsService.submitApplication(formData).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message ?? 'No se pudo enviar tu postulacion. Intentalo nuevamente.');
      },
    });
  }
}
