import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      @if (!token()) {
        <div class="card text-center">
          <p class="text-lg font-bold text-marino-900">Enlace no válido</p>
          <p class="mt-2 text-sm text-marino-500">Solicita un nuevo enlace para restablecer tu contraseña.</p>
          <a routerLink="/olvide-contrasena" class="btn-secondary mt-6 inline-flex">Solicitar enlace</a>
        </div>
      } @else if (success()) {
        <div class="card text-center">
          <p class="text-lg font-bold text-marino-900">¡Contraseña actualizada!</p>
          <p class="mt-2 text-sm text-marino-500">Ya puedes iniciar sesión con tu nueva contraseña.</p>
          <a routerLink="/ingresar" class="btn-primary mt-6 inline-flex">Ir a iniciar sesión</a>
        </div>
      } @else {
        <div class="card">
          <h1 class="text-2xl font-extrabold text-marino-900">Restablece tu contraseña</h1>
          <p class="mt-1 text-sm text-marino-500">Ingresa tu nueva contraseña.</p>

          <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="onSubmit()">
            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">Nueva contraseña</label>
              <input type="password" formControlName="password" class="input-field" [class.input-error]="isInvalid('password')" />
              @if (isInvalid('password')) {
                <p class="field-error">La contraseña debe tener al menos 8 caracteres.</p>
              }
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-marino-800">Confirma tu nueva contraseña</label>
              <input type="password" formControlName="confirmPassword" class="input-field" [class.input-error]="form.errors?.['passwordsMismatch'] && form.get('confirmPassword')?.touched" />
              @if (form.errors?.['passwordsMismatch'] && form.get('confirmPassword')?.touched) {
                <p class="field-error">Las contraseñas no coinciden.</p>
              }
            </div>

            @if (errorMessage()) {
              <div class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage() }}</div>
            }

            <button type="submit" class="btn-primary w-full" [disabled]="form.invalid || loading()">
              {{ loading() ? 'Guardando...' : 'Restablecer contraseña' }}
            </button>
          </form>
        </div>
      }
    </section>
  `,
})
export class ResetPasswordComponent implements OnInit {
  readonly token = signal<string | null>(null);
  readonly loading = signal(false);
  readonly success = signal(false);
  readonly errorMessage = signal<string | null>(null);

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator },
  );

  ngOnInit(): void {
    this.token.set(this.route.snapshot.queryParamMap.get('token'));
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    const token = this.token();
    if (this.form.invalid || !token) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.resetPassword(token, this.form.getRawValue().password).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/ingresar']), 2500);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message ?? 'No se pudo restablecer tu contraseña. Inténtalo nuevamente.');
      },
    });
  }
}
