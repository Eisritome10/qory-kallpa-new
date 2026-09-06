import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      @if (registeredEmail(); as email) {
        <div class="card text-center">
          <p class="text-lg font-bold text-marino-900">Revisa tu correo</p>
          <p class="mt-2 text-sm text-marino-500">
            Enviamos un enlace de verificación a <span class="font-semibold text-marino-800">{{ email }}</span>.
            Confirma tu correo para poder iniciar sesión.
          </p>

          <button type="button" class="btn-secondary mt-6 w-full" [disabled]="resending() || resent()" (click)="onResend(email)">
            {{ resent() ? 'Correo reenviado' : resending() ? 'Reenviando...' : 'No recibí el correo, reenviar' }}
          </button>

          <p class="mt-6 text-center text-sm text-marino-500">
            <a routerLink="/ingresar" class="font-semibold text-naranja-600 hover:underline">Ir a iniciar sesión</a>
          </p>
        </div>
      } @else {
        <div class="card">
          <h1 class="text-2xl font-extrabold text-marino-900">Crea tu cuenta de postulante</h1>
          <p class="mt-1 text-sm text-marino-500">Necesitas una cuenta para enviar tu postulación como voluntario/a.</p>

          <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="onSubmit()">
            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">Nombre completo</label>
              <input type="text" formControlName="fullName" class="input-field" [class.input-error]="isInvalid('fullName')" />
              @if (isInvalid('fullName')) {
                <p class="field-error">Ingresa tu nombre completo (mínimo 3 caracteres).</p>
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
              <label class="mb-1 block text-sm font-medium text-marino-800">Contraseña</label>
              <input type="password" formControlName="password" class="input-field" [class.input-error]="isInvalid('password')" />
              @if (isInvalid('password')) {
                <p class="field-error">La contraseña debe tener al menos 8 caracteres.</p>
              }
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">Confirma tu contraseña</label>
              <input type="password" formControlName="confirmPassword" class="input-field" [class.input-error]="isInvalid('confirmPassword') || (form.errors?.['passwordsMismatch'] && form.get('confirmPassword')?.touched)" />
              @if (form.errors?.['passwordsMismatch'] && form.get('confirmPassword')?.touched) {
                <p class="field-error">Las contraseñas no coinciden.</p>
              }
            </div>

            @if (errorMessage()) {
              <div class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage() }}</div>
            }

            <button type="submit" class="btn-primary w-full" [disabled]="form.invalid || loading()">
              {{ loading() ? 'Creando cuenta...' : 'Crear cuenta' }}
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-marino-500">
            ¿Ya tienes cuenta?
            <a routerLink="/ingresar" class="font-semibold text-naranja-600 hover:underline">Ingresa aquí</a>
          </p>
        </div>
      }
    </section>
  `,
})
export class RegisterComponent {
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly registeredEmail = signal<string | null>(null);
  readonly resending = signal(false);
  readonly resent = signal(false);

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator },
  );

  constructor(private readonly authService: AuthService) {}

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { fullName, email, password } = this.form.getRawValue();

    this.authService.register({ fullName, email, password }).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.registeredEmail.set(response.email);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message ?? 'No se pudo crear la cuenta. Inténtalo nuevamente.');
      },
    });
  }

  onResend(email: string): void {
    this.resending.set(true);
    this.authService.resendVerification(email).subscribe({
      next: () => {
        this.resending.set(false);
        this.resent.set(true);
      },
      error: () => {
        this.resending.set(false);
      },
    });
  }
}
