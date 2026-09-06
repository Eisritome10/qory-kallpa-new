import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DIRECTOR_ROLES } from '../../core/models/user.model';

type VerifyState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div class="card text-center">
        @switch (state()) {
          @case ('loading') {
            <p class="text-marino-600">Verificando tu correo...</p>
          }
          @case ('success') {
            <p class="text-lg font-bold text-marino-900">¡Correo verificado!</p>
            <p class="mt-2 text-sm text-marino-500">Tu cuenta esta activa. Redirigiendote...</p>
          }
          @case ('error') {
            <p class="text-lg font-bold text-marino-900">No pudimos verificar tu correo</p>
            <p class="mt-2 text-sm text-marino-500">{{ errorMessage() }}</p>
            <a routerLink="/ingresar" class="btn-secondary mt-6 inline-flex">Ir a iniciar sesion</a>
          }
        }
      </div>
    </section>
  `,
})
export class VerifyEmailComponent implements OnInit {
  readonly state = signal<VerifyState>('loading');
  readonly errorMessage = signal('El enlace no es valido o ya expiro. Solicita uno nuevo desde la pantalla de ingreso.');

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.state.set('error');
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: ({ user }) => {
        this.state.set('success');
        setTimeout(() => {
          this.router.navigate([DIRECTOR_ROLES.includes(user.role) ? '/admin' : '/postular']);
        }, 1500);
      },
      error: (error: HttpErrorResponse) => {
        this.state.set('error');
        if (error.error?.message) this.errorMessage.set(error.error.message);
      },
    });
  }
}
