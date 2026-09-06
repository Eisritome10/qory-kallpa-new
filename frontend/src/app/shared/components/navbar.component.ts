import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ROLE_LABELS } from '../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-40 border-b border-marino-800/10 bg-white/95 backdrop-blur">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a routerLink="/" class="flex items-center gap-2">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-full bg-marino-800 text-lg font-extrabold text-naranja-400"
            >QK</span
          >
          <span class="leading-tight">
            <span class="block text-base font-bold text-marino-900">Qori Kallpa</span>
            <span class="block text-xs font-medium text-naranja-600">Voces con Poder</span>
          </span>
        </a>

        <button
          type="button"
          class="rounded-md p-2 text-marino-800 sm:hidden"
          (click)="mobileOpen.set(!mobileOpen())"
          aria-label="Abrir menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="hidden items-center gap-6 sm:flex">
          <a routerLink="/" routerLinkActive="text-naranja-600" [routerLinkActiveOptions]="{ exact: true }" class="text-sm font-semibold text-marino-800 hover:text-naranja-600">Inicio</a>
          <a routerLink="/postular" routerLinkActive="text-naranja-600" class="text-sm font-semibold text-marino-800 hover:text-naranja-600">Postular</a>

          @if (auth.currentUser()?.role === 'POSTULANTE') {
            <a routerLink="/mis-postulaciones" routerLinkActive="text-naranja-600" class="text-sm font-semibold text-marino-800 hover:text-naranja-600">Mis postulaciones</a>
          }

          @if (auth.isDirector()) {
            <a routerLink="/admin" routerLinkActive="text-naranja-600" class="text-sm font-semibold text-marino-800 hover:text-naranja-600">Panel administrativo</a>
          }

          @if (auth.isAuthenticated()) {
            <div class="flex items-center gap-3 border-l border-marino-100 pl-6">
              <span class="text-xs text-marino-600">
                {{ auth.currentUser()?.fullName }}
                <span class="block text-[10px] uppercase tracking-wide text-marino-400">{{ roleLabel() }}</span>
              </span>
              <button type="button" class="btn-secondary !px-4 !py-2 text-sm" (click)="auth.logout()">Salir</button>
            </div>
          } @else {
            <a routerLink="/ingresar" class="btn-secondary !px-4 !py-2 text-sm">Ingresar</a>
          }
        </div>
      </nav>

      @if (mobileOpen()) {
        <div class="space-y-1 border-t border-marino-100 px-4 py-3 sm:hidden">
          <a routerLink="/" (click)="mobileOpen.set(false)" class="block rounded-md px-3 py-2 text-sm font-semibold text-marino-800 hover:bg-marino-50">Inicio</a>
          <a routerLink="/postular" (click)="mobileOpen.set(false)" class="block rounded-md px-3 py-2 text-sm font-semibold text-marino-800 hover:bg-marino-50">Postular</a>
          @if (auth.currentUser()?.role === 'POSTULANTE') {
            <a routerLink="/mis-postulaciones" (click)="mobileOpen.set(false)" class="block rounded-md px-3 py-2 text-sm font-semibold text-marino-800 hover:bg-marino-50">Mis postulaciones</a>
          }
          @if (auth.isDirector()) {
            <a routerLink="/admin" (click)="mobileOpen.set(false)" class="block rounded-md px-3 py-2 text-sm font-semibold text-marino-800 hover:bg-marino-50">Panel administrativo</a>
          }
          @if (auth.isAuthenticated()) {
            <button type="button" class="block w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50" (click)="auth.logout()">Salir</button>
          } @else {
            <a routerLink="/ingresar" (click)="mobileOpen.set(false)" class="block rounded-md px-3 py-2 text-sm font-semibold text-naranja-600 hover:bg-naranja-50">Ingresar</a>
          }
        </div>
      }
    </header>
  `,
})
export class NavbarComponent {
  readonly mobileOpen = signal(false);

  constructor(public readonly auth: AuthService) {}

  roleLabel(): string {
    const role = this.auth.currentUser()?.role;
    return role ? ROLE_LABELS[role] : '';
  }
}
