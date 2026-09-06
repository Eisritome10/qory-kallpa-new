import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      @if (sent()) {
        <div class="card text-center">
          <p class="text-lg font-bold text-marino-900">Revisa tu correo</p>
          <p class="mt-2 text-sm text-marino-500">
            Si el correo <span class="font-semibold text-marino-800">{{ sentEmail() }}</span> está registrado, te
            enviamos un enlace para restablecer tu contraseña.
          </p>
          <a routerLink="/ingresar" class="btn-secondary mt-6 inline-flex">Ir a iniciar sesión</a>
        </div>
      } @else {
        <div class="card">
          <h1 class="text-2xl font-extrabold text-marino-900">¿Olvidaste tu contraseña?</h1>
          <p class="mt-1 text-sm text-marino-500">Ingresa tu correo y te enviaremos un enlace para restablecerla.</p>

          <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="onSubmit()">
            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">Correo electrónico</label>
              <input type="email" formControlName="email" class="input-field" [class.input-error]="isInvalid('email')" />
              @if (isInvalid('email')) {
                <p class="field-error">Ingresa un correo válido.</p>
              }
            </div>

            @if (errorMessage()) {
              <div class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage() }}</div>
            }

            <button type="submit" class="btn-primary w-full" [disabled]="form.invalid || loading()">
              {{ loading() ? 'Enviando...' : 'Enviar enlace' }}
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-marino-500">
            <a routerLink="/ingresar" class="font-semibold text-naranja-600 hover:underline">Volver a iniciar sesión</a>
          </p>
        </div>
      }
    </section>
  `,
})
export class ForgotPasswordComponent {
  readonly loading = signal(false);
  readonly sent = signal(false);
  readonly sentEmail = signal('');
  readonly errorMessage = signal<string | null>(null);

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email } = this.form.getRawValue();
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.loading.set(false);
        this.sentEmail.set(email);
        this.sent.set(true);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('No se pudo procesar tu solicitud. Inténtalo nuevamente.');
      },
    });
  }
}
