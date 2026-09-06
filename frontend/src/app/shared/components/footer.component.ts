import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="relative overflow-hidden bg-marino-900 text-marino-100">
      <span class="pointer-events-none absolute -bottom-10 -right-10 select-none text-[10rem] font-extrabold leading-none text-white/[0.03]" aria-hidden="true">QK</span>
      <div class="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div class="flex items-center gap-2">
              <img src="assets/logo-mark.png" alt="Qori Kallpa" class="h-9 w-9 rounded-full object-cover ring-1 ring-white/20" />
              <span class="text-lg font-bold text-white">Qori Kallpa</span>
            </div>
            <p class="mt-3 text-sm text-marino-300">
              Voces con Poder. Promovemos, preservamos y revitalizamos las culturas y lenguas originarias de América Latina.
            </p>
          </div>

          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wide text-naranja-400">Navegación</h3>
            <ul class="mt-3 space-y-2 text-sm text-marino-300">
              <li><a routerLink="/" class="hover:text-white">Inicio</a></li>
              <li><a routerLink="/postular" class="hover:text-white">Postular</a></li>
              <li><a href="#donar" class="hover:text-white">Donar</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wide text-naranja-400">Contacto</h3>
            <ul class="mt-3 space-y-2 text-sm text-marino-300">
              <li>contacto&#64;qorikallpa.org</li>
              <li>Lima, Perú</li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wide text-naranja-400">Síguenos</h3>
            <div class="mt-3 flex gap-3">
              @for (icon of socialIcons; track icon.label) {
                <a
                  [href]="icon.href"
                  target="_blank"
                  rel="noopener"
                  [attr.aria-label]="icon.label"
                  class="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-marino-200 transition hover:bg-naranja-500 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path [attr.d]="icon.path" />
                  </svg>
                </a>
              }
            </div>
          </div>
        </div>

        <div class="mt-12 border-t border-white/10 pt-6 text-center text-xs text-marino-400">
          &copy; {{ year }} Qori Kallpa. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  readonly socialIcons = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/qori_kallpa/',
      path: 'M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.256 1.216.6 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.05 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.05-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.01 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.065.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.01 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.181-.8.398-1.15.748-.35.35-.566.683-.747 1.15-.137.352-.3.881-.344 1.857-.05 1.054-.06 1.37-.06 4.04 0 2.67.01 2.986.06 4.04.045.976.207 1.505.344 1.858.181.466.398.8.747 1.15.35.35.684.566 1.15.747.353.137.882.3 1.858.344 1.054.05 1.37.06 4.04.06 2.67 0 2.987-.01 4.04-.06.976-.045 1.506-.207 1.858-.344.466-.181.8-.398 1.15-.747.35-.35.567-.684.748-1.15.137-.353.3-.882.344-1.858.05-1.054.06-1.37.06-4.04 0-2.67-.01-2.986-.06-4.04-.045-.976-.207-1.505-.344-1.858a3.09 3.09 0 00-.748-1.15 3.096 3.096 0 00-1.15-.747c-.352-.137-.881-.3-1.857-.344-1.054-.05-1.37-.06-4.04-.06zm0 4.594a5.604 5.604 0 110 11.208 5.604 5.604 0 010-11.208zm0 9.242a3.638 3.638 0 100-7.276 3.638 3.638 0 000 7.276zm7.14-9.466a1.31 1.31 0 11-2.62 0 1.31 1.31 0 012.62 0z',
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@qory.kallpa?is_from_webapp=1&sender_device=pc',
      path: 'M16.6 5.82c-1.02-.88-1.64-2.15-1.66-3.56V2h-3.4v13.4a2.59 2.59 0 11-2.13-2.55v-3.44a5.98 5.98 0 00-.87-.06A6 6 0 108.6 21a6 6 0 006-6V9.02a8.16 8.16 0 004.77 1.53V7.16a4.85 4.85 0 01-2.77-1.34z',
    },
  ];
}
