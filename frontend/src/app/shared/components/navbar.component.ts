import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ROLE_LABELS } from '../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header
      class="sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow"
      [ngClass]="scrolled() ? 'border-transparent shadow-sm' : 'border-marino-800/10'"
    >
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a routerLink="/" class="flex items-center gap-2">
          <img src="assets/logo-mark.png" alt="Qori Kallpa" class="h-10 w-10 rounded-full object-cover ring-1 ring-marino-900/10" />
          <span class="leading-tight">
            <span class="block text-base font-bold text-marino-900">Qori Kallpa</span>
            <span class="block text-xs font-medium text-naranja-600">Voces con Poder</span>
          </span>
        </a>

        <button
          type="button"
          class="rounded-md p-2 text-marino-800 sm:hidden"
          (click)="mobileOpen.set(!mobileOpen())"
          aria-label="Abrir menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="hidden items-center gap-6 sm:flex">
          <a routerLink="/" routerLinkActive="text-naranja-600" [routerLinkActiveOptions]="{ exact: true }" class="text-sm font-semibold text-marino-800 hover:text-naranja-600">Inicio</a>

          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-1 text-sm font-semibold text-marino-800 hover:text-naranja-600"
              [class.text-naranja-600]="aboutOpen()"
              (click)="aboutOpen.set(!aboutOpen())"
            >
              Nosotros
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 transition-transform" [class.rotate-180]="aboutOpen()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            @if (aboutOpen()) {
              <div class="absolute left-0 top-full mt-2 w-48 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5">
                <a routerLink="/equipo" (click)="aboutOpen.set(false)" class="block rounded-lg px-3 py-2 text-sm font-medium text-marino-700 hover:bg-marino-50">Equipo</a>
                <a routerLink="/proyectos" (click)="aboutOpen.set(false)" class="block rounded-lg px-3 py-2 text-sm font-medium text-marino-700 hover:bg-marino-50">Proyectos</a>
                <a routerLink="/alianzas" (click)="aboutOpen.set(false)" class="block rounded-lg px-3 py-2 text-sm font-medium text-marino-700 hover:bg-marino-50">Alianzas</a>
              </div>
            }
          </div>

          <a routerLink="/postular" routerLinkActive="text-naranja-600" class="text-sm font-semibold text-marino-800 hover:text-naranja-600">Postular</a>

          @if (auth.currentUser()?.role === 'POSTULANTE') {
            <a routerLink="/mis-postulaciones" routerLinkActive="text-naranja-600" class="text-sm font-semibold text-marino-800 hover:text-naranja-600">Mis postulaciones</a>
          }

          @if (auth.isDirector()) {
            <a routerLink="/admin" routerLinkActive="text-naranja-600" class="text-sm font-semibold text-marino-800 hover:text-naranja-600">Panel administrativo</a>
          }

          @if (auth.isAuthenticated()) {
            <div class="relative border-l border-marino-100 pl-6">
              <button type="button" class="flex items-center gap-2" (click)="userMenuOpen.set(!userMenuOpen())">
                @if (auth.currentUser()?.avatarUrl; as avatarUrl) {
                  <img [src]="avatarUrl" alt="Foto de perfil" class="h-8 w-8 rounded-full object-cover ring-1 ring-marino-200" />
                } @else {
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-marino-800 text-xs font-extrabold text-naranja-400">
                    {{ initials() }}
                  </span>
                }
                <span class="text-xs text-marino-600 text-left">
                  {{ auth.currentUser()?.fullName }}
                  <span class="block text-[10px] uppercase tracking-wide text-marino-400">{{ roleLabel() }}</span>
                </span>
              </button>

              @if (userMenuOpen()) {
                <div class="absolute right-0 top-full mt-2 w-44 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5">
                  <a routerLink="/perfil" (click)="userMenuOpen.set(false)" class="block rounded-lg px-3 py-2 text-sm font-medium text-marino-700 hover:bg-marino-50">Mi perfil</a>
                  <button type="button" class="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50" (click)="auth.logout()">Salir</button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/ingresar" class="btn-secondary !px-4 !py-2 text-sm">Ingresar</a>
          }
        </div>
      </nav>

      @if (mobileOpen()) {
        <div class="space-y-1 border-t border-marino-100 px-4 py-3 sm:hidden">
          <a routerLink="/" (click)="mobileOpen.set(false)" class="block rounded-md px-3 py-2 text-sm font-semibold text-marino-800 hover:bg-marino-50">Inicio</a>

          <p class="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-marino-400">Nosotros</p>
          <a routerLink="/equipo" (click)="mobileOpen.set(false)" class="block rounded-md px-3 py-2 text-sm font-semibold text-marino-800 hover:bg-marino-50">Equipo</a>
          <a routerLink="/proyectos" (click)="mobileOpen.set(false)" class="block rounded-md px-3 py-2 text-sm font-semibold text-marino-800 hover:bg-marino-50">Proyectos</a>
          <a routerLink="/alianzas" (click)="mobileOpen.set(false)" class="block rounded-md px-3 py-2 text-sm font-semibold text-marino-800 hover:bg-marino-50">Alianzas</a>

          <a routerLink="/postular" (click)="mobileOpen.set(false)" class="block rounded-md px-3 py-2 text-sm font-semibold text-marino-800 hover:bg-marino-50">Postular</a>
          @if (auth.currentUser()?.role === 'POSTULANTE') {
            <a routerLink="/mis-postulaciones" (click)="mobileOpen.set(false)" class="block rounded-md px-3 py-2 text-sm font-semibold text-marino-800 hover:bg-marino-50">Mis postulaciones</a>
          }
          @if (auth.isDirector()) {
            <a routerLink="/admin" (click)="mobileOpen.set(false)" class="block rounded-md px-3 py-2 text-sm font-semibold text-marino-800 hover:bg-marino-50">Panel administrativo</a>
          }
          @if (auth.isAuthenticated()) {
            <a routerLink="/perfil" (click)="mobileOpen.set(false)" class="block rounded-md px-3 py-2 text-sm font-semibold text-marino-800 hover:bg-marino-50">Mi perfil</a>
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
  readonly scrolled = signal(false);
  readonly aboutOpen = signal(false);
  readonly userMenuOpen = signal(false);

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  constructor(public readonly auth: AuthService) {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      if (this.aboutOpen()) this.aboutOpen.set(false);
      if (this.userMenuOpen()) this.userMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.aboutOpen.set(false);
    this.userMenuOpen.set(false);
  }

  roleLabel(): string {
    const role = this.auth.currentUser()?.role;
    return role ? ROLE_LABELS[role] : '';
  }

  initials(): string {
    const fullName = this.auth.currentUser()?.fullName ?? '';
    return fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }
}
