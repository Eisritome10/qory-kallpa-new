import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DIRECTOR_ROLES } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div class="card">
        <h1 class="text-2xl font-extrabold text-marino-900">Ingresa a tu cuenta</h1>
        <p class="mt-1 text-sm text-marino-500">Postulantes y equipo directivo de Qori Kallpa.</p>

        <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div>
            <label class="mb-1 block text-sm font-medium text-marino-800">Correo electrónico</label>
            <input
              type="email"
              formControlName="email"
              class="input-field"
              [class.input-error]="isInvalid('email')"
              placeholder="correo@ejemplo.com"
            />
            @if (isInvalid('email')) {
              <p class="field-error">Ingresa un correo válido.</p>
            }
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-marino-800">Contraseña</label>
            <input
              type="password"
              formControlName="password"
              class="input-field"
              [class.input-error]="isInvalid('password')"
              placeholder="********"
            />
            @if (isInvalid('password')) {
              <p class="field-error">La contraseña es obligatoria.</p>
            }
          </div>

          @if (errorMessage()) {
            <div class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {{ errorMessage() }}
              @if (needsVerification()) {
                <button
                  type="button"
                  class="mt-2 block font-semibold text-naranja-600 hover:underline"
                  [disabled]="resending() || resent()"
                  (click)="onResendVerification()"
                >
                  {{ resent() ? 'Correo reenviado' : resending() ? 'Reenviando...' : 'Reenviar correo de verificación' }}
                </button>
              }
            </div>
          }

          <button type="submit" class="btn-primary w-full" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-marino-500">
          ¿Aún no tienes cuenta?
          <a routerLink="/registrarse" class="font-semibold text-naranja-600 hover:underline">Regístrate aquí</a>
        </p>
      </div>
    </section>
  `,
})
export class LoginComponent {
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly needsVerification = signal(false);
  readonly resending = signal(false);
  readonly resent = signal(false);

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

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
    this.needsVerification.set(false);
    this.resent.set(false);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: ({ user }) => {
        this.loading.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else if (DIRECTOR_ROLES.includes(user.role)) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/mis-postulaciones']);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message ?? 'No se pudo iniciar sesión. Inténtalo nuevamente.');
        this.needsVerification.set(error.status === 403);
      },
    });
  }

  onResendVerification(): void {
    const email = this.form.getRawValue().email;
    if (!email) return;

    this.resending.set(true);
    this.authService.resendVerification(email).subscribe({
      next: () => {
        this.resending.set(false);
        this.resent.set(true);
      },
      error: () => this.resending.set(false),
    });
  }
}
