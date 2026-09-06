import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ROLE_LABELS } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="flex min-h-screen bg-gray-50">
      <aside class="hidden w-64 flex-col bg-marino-900 text-white sm:flex">
        <div class="flex items-center gap-2 px-6 py-5">
          <img src="assets/logo-mark.png" alt="Qori Kallpa" class="h-9 w-9 rounded-full object-cover ring-1 ring-white/20" />
          <span class="text-lg font-bold">Panel Qori Kallpa</span>
        </div>
        <nav class="mt-4 flex-1 space-y-1 px-3">
          <a
            routerLink="/admin"
            [routerLinkActiveOptions]="{ exact: true }"
            routerLinkActive="bg-marino-700 text-white"
            class="block rounded-lg px-4 py-2.5 text-sm font-medium text-marino-200 hover:bg-marino-800"
          >
            Postulaciones
          </a>
          <a
            routerLink="/admin/metricas"
            routerLinkActive="bg-marino-700 text-white"
            class="block rounded-lg px-4 py-2.5 text-sm font-medium text-marino-200 hover:bg-marino-800"
          >
            Métricas e indicadores
          </a>
        </nav>
        <div class="border-t border-white/10 px-4 py-4">
          <p class="text-sm font-semibold">{{ auth.currentUser()?.fullName }}</p>
          <p class="text-xs text-marino-300">{{ roleLabel() }}</p>
          <a routerLink="/perfil" class="mt-3 block text-xs font-semibold text-marino-300 hover:text-white">Mi perfil</a>
          <button type="button" class="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20" (click)="auth.logout()">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div class="flex-1">
        <header class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:hidden">
          <span class="text-sm font-bold text-marino-900">Panel Qori Kallpa</span>
          <a routerLink="/" class="text-xs font-semibold text-naranja-600">Salir al sitio</a>
        </header>
        <main class="p-4 sm:p-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminShellComponent {
  constructor(public readonly auth: AuthService) {}

  roleLabel(): string {
    const role = this.auth.currentUser()?.role;
    return role ? ROLE_LABELS[role] : '';
  }
}
