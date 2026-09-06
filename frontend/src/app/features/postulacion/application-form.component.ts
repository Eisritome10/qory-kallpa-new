import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApplicationsService } from '../../core/services/applications.service';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { AreaVoluntariado } from '../../core/models/application.model';

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

const AREA_OPTIONS: { value: AreaVoluntariado; label: string }[] = [
  { value: 'ALIANZAS_RECAUDACION', label: 'Alianzas y Recaudación' },
  { value: 'TECNOLOGIA_SISTEMAS', label: 'Tecnología y Sistemas' },
  { value: 'SUPERVISION_PROYECTOS', label: 'Supervisión de Proyectos' },
  { value: 'PROGRAMAS', label: 'Programas' },
  { value: 'EVENTOS', label: 'Eventos' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'GESTION_HUMANA', label: 'Gestión Humana' },
];

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-extrabold text-marino-900">Postula como voluntario/a</h1>
        <p class="mt-2 text-marino-500">Completa tus datos y adjunta tu CV en formato PDF.</p>
      </div>

      @if (success()) {
        <div class="card text-center">
          <p class="text-lg font-bold text-marino-900">¡Postulación enviada con éxito!</p>
          <p class="mt-2 text-sm text-marino-500">
            Revisaremos tu información y te contactaremos por correo. Puedes seguir el estado desde
            "Mis postulaciones".
          </p>
        </div>
      } @else {
        <form class="card space-y-5" [formGroup]="form" (ngSubmit)="onSubmit()">
          @if (prefilled()) {
            <div class="rounded-lg bg-marino-50 px-4 py-3 text-sm text-marino-600">
              Completamos algunos datos con tu <a routerLink="/perfil" class="font-semibold text-naranja-600 hover:underline">perfil</a>. Revísalos y ajústalos si es necesario.
            </div>
          }

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">Nombre completo</label>
              <input type="text" formControlName="fullName" class="input-field" [class.input-error]="isInvalid('fullName')" />
              @if (isInvalid('fullName')) {
                <p class="field-error">Ingresa tu nombre completo.</p>
              }
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">Correo electrónico</label>
              <input type="email" formControlName="email" class="input-field" [class.input-error]="isInvalid('email')" />
              @if (isInvalid('email')) {
                <p class="field-error">Ingresa un correo válido.</p>
              }
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">Teléfono</label>
              <input type="tel" formControlName="phone" class="input-field" [class.input-error]="isInvalid('phone')" placeholder="+51 999 999 999" />
              @if (isInvalid('phone')) {
                <p class="field-error">Ingresa un teléfono válido.</p>
              }
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">DNI / Documento</label>
              <input type="text" formControlName="dni" class="input-field" [class.input-error]="isInvalid('dni')" />
              @if (isInvalid('dni')) {
                <p class="field-error">Ingresa un documento válido.</p>
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
              <label class="mb-1 block text-sm font-medium text-marino-800">Área de interés</label>
              <select formControlName="area" class="input-field" [class.input-error]="isInvalid('area')">
                <option value="" disabled>Selecciona un área</option>
                @for (option of areaOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
              @if (isInvalid('area')) {
                <p class="field-error">Selecciona un área de voluntariado.</p>
              }
            </div>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-marino-800">Disponibilidad</label>
            <input type="text" formControlName="availability" class="input-field" [class.input-error]="isInvalid('availability')" placeholder="Ej: Fines de semana, 4 horas semanales" />
            @if (isInvalid('availability')) {
              <p class="field-error">Cuéntanos tu disponibilidad.</p>
            }
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-marino-800">¿Por qué quieres ser voluntario/a?</label>
            <textarea formControlName="motivation" rows="4" class="input-field" [class.input-error]="isInvalid('motivation')"></textarea>
            @if (isInvalid('motivation')) {
              <p class="field-error">Cuéntanos tu motivación (mínimo 20 caracteres).</p>
            }
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-marino-800">CV (PDF, máximo 5MB)</label>
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
            {{ loading() ? 'Enviando postulación...' : 'Enviar postulación' }}
          </button>
        </form>
      }
    </section>
  `,
})
export class ApplicationFormComponent implements OnInit {
  readonly areaOptions = AREA_OPTIONS;
  readonly loading = signal(false);
  readonly success = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly fileError = signal<string | null>(null);
  readonly selectedFile = signal<File | null>(null);
  readonly prefilled = signal(false);

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
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser?.email) {
      this.form.patchValue({ fullName: currentUser.fullName, email: currentUser.email });
    }

    this.usersService.getProfile().subscribe({
      next: (profile) => {
        const patch: Record<string, string> = {};
        if (profile.fullName) patch['fullName'] = profile.fullName;
        if (profile.phone) patch['phone'] = profile.phone;
        if (profile.dni) patch['dni'] = profile.dni;
        if (profile.birthDate) patch['birthDate'] = profile.birthDate.substring(0, 10);

        if (Object.keys(patch).length > 0) {
          this.form.patchValue(patch);
          this.prefilled.set(true);
        }
      },
      error: () => {
        // El formulario sigue funcionando aunque no se pueda precargar el perfil.
      },
    });
  }

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
        if (error.status === 409) {
          this.errorMessage.set(error.error?.message ?? 'Ya tienes una postulación registrada para esta área.');
        } else {
          this.errorMessage.set(error.error?.message ?? 'No se pudo enviar tu postulación. Inténtalo nuevamente.');
        }
      },
    });
  }
}
