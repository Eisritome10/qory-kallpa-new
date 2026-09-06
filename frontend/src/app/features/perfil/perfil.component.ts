import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { ROLE_LABELS, UserProfile } from '../../core/models/user.model';

const MAX_AVATAR_SIZE_BYTES = 3 * 1024 * 1024;

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-marino-900">Mi perfil</h1>
        <p class="mt-1 text-marino-500">Actualiza tu información personal y tu foto de perfil.</p>
      </div>

      @if (loading()) {
        <p class="text-marino-500">Cargando...</p>
      } @else {
      @if (profile(); as profile) {
        <div class="card flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div class="relative">
            @if (profile.avatarUrl) {
              <img [src]="profile.avatarUrl" alt="Foto de perfil" class="h-24 w-24 rounded-full object-cover ring-2 ring-marino-100" />
            } @else {
              <span class="flex h-24 w-24 items-center justify-center rounded-full bg-marino-800 text-2xl font-extrabold text-naranja-400 ring-2 ring-marino-100">
                {{ initials(profile.fullName) }}
              </span>
            }

            <label
              class="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-naranja-500 text-white shadow-md transition hover:bg-naranja-600"
              title="Cambiar foto de perfil"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
              <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" (change)="onAvatarSelected($event)" />
            </label>
          </div>

          <div class="flex-1 text-center sm:text-left">
            <p class="text-lg font-bold text-marino-900">{{ profile.fullName }}</p>
            <p class="text-sm text-marino-500">{{ profile.email }}</p>
            <span class="mt-2 inline-flex items-center rounded-full bg-marino-50 px-3 py-1 text-xs font-semibold text-marino-700">
              {{ roleLabel(profile) }}
            </span>
            <p class="mt-2 text-xs text-marino-400">Miembro desde {{ profile.createdAt | date: 'dd/MM/yyyy' }}</p>

            @if (avatarError()) {
              <p class="field-error">{{ avatarError() }}</p>
            }
            @if (avatarUploading()) {
              <p class="mt-1 text-xs text-marino-500">Subiendo foto...</p>
            }
          </div>
        </div>

        <form class="card mt-6 space-y-5" [formGroup]="form" (ngSubmit)="onSubmit()">
          <h2 class="text-lg font-bold text-marino-900">Información personal</h2>

          <div>
            <label class="mb-1 block text-sm font-medium text-marino-800">Nombre completo</label>
            <input type="text" formControlName="fullName" class="input-field" [class.input-error]="isInvalid('fullName')" />
            @if (isInvalid('fullName')) {
              <p class="field-error">Ingresa tu nombre completo (mínimo 3 caracteres).</p>
            }
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
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
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-marino-800">Fecha de nacimiento</label>
            <input type="date" formControlName="birthDate" class="input-field sm:max-w-xs" />
          </div>

          @if (successMessage()) {
            <div class="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{{ successMessage() }}</div>
          }
          @if (errorMessage()) {
            <div class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage() }}</div>
          }

          <button type="submit" class="btn-primary" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </form>

        <div class="mt-6 rounded-xl bg-marino-50 p-4 text-sm text-marino-600">
          Tip: al mantener tu información actualizada aquí, tus próximas postulaciones se completarán automáticamente
          con estos datos.
        </div>
      }
      }
    </section>
  `,
})
export class PerfilComponent implements OnInit {
  readonly profile = signal<UserProfile | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly avatarUploading = signal(false);
  readonly avatarError = signal<string | null>(null);

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.pattern(/^[0-9+\s-]{6,15}$/)]],
    dni: ['', [Validators.pattern(/^[0-9A-Za-z]{6,12}$/)]],
    birthDate: [''],
  });

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.usersService.getProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.form.patchValue({
          fullName: profile.fullName,
          phone: profile.phone ?? '',
          dni: profile.dni ?? '',
          birthDate: profile.birthDate ? profile.birthDate.substring(0, 10) : '',
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  roleLabel(profile: UserProfile): string {
    return ROLE_LABELS[profile.role];
  }

  initials(fullName: string): string {
    return fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();
    this.usersService
      .updateProfile({
        fullName: raw.fullName,
        phone: raw.phone || undefined,
        dni: raw.dni || undefined,
        birthDate: raw.birthDate ? new Date(raw.birthDate).toISOString() : undefined,
      })
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.authService.updateCachedUser({ fullName: profile.fullName });
          this.saving.set(false);
          this.successMessage.set('Tus datos se actualizaron correctamente.');
        },
        error: (error: HttpErrorResponse) => {
          this.saving.set(false);
          this.errorMessage.set(error.error?.message ?? 'No se pudo actualizar tu perfil. Inténtalo nuevamente.');
        },
      });
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.avatarError.set(null);

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.avatarError.set('La imagen debe ser JPG, PNG o WEBP.');
      input.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      this.avatarError.set('La imagen no debe superar los 3MB.');
      input.value = '';
      return;
    }

    this.avatarUploading.set(true);
    this.usersService.updateAvatar(file).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.authService.updateCachedUser({ avatarUrl: profile.avatarUrl });
        this.avatarUploading.set(false);
        input.value = '';
      },
      error: () => {
        this.avatarUploading.set(false);
        this.avatarError.set('No se pudo subir la foto. Inténtalo nuevamente.');
        input.value = '';
      },
    });
  }
}
