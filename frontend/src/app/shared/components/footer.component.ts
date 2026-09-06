import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-marino-900 text-marino-100">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid gap-8 sm:grid-cols-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-naranja-500 text-sm font-extrabold text-white">QK</span>
              <span class="text-lg font-bold text-white">Qori Kallpa</span>
            </div>
            <p class="mt-3 text-sm text-marino-300">Voces con Poder. Fortalecemos comunidades a traves del voluntariado y la accion social.</p>
          </div>
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wide text-naranja-400">Contacto</h3>
            <ul class="mt-3 space-y-2 text-sm text-marino-300">
              <li>contacto&#64;qorikallpa.org</li>
              <li>Lima, Peru</li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wide text-naranja-400">Sigue nuestra labor</h3>
            <p class="mt-3 text-sm text-marino-300">Cada aporte y cada hora de voluntariado suman fuerza a nuestras comunidades.</p>
          </div>
        </div>
        <div class="mt-10 border-t border-white/10 pt-6 text-center text-xs text-marino-400">
          &copy; {{ year }} Qori Kallpa. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
