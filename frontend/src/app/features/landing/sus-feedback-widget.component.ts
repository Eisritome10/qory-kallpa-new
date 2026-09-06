import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SusEvaluationService } from '../../core/services/sus-evaluation.service';

interface SusQuestion {
  key: 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'q9' | 'q10';
  text: string;
}

const QUESTIONS: SusQuestion[] = [
  { key: 'q1', text: 'Creo que usaría este sitio con frecuencia.' },
  { key: 'q2', text: 'Encontré el sitio innecesariamente complejo.' },
  { key: 'q3', text: 'Me pareció fácil de usar.' },
  { key: 'q4', text: 'Necesitaría ayuda de otra persona para usarlo.' },
  { key: 'q5', text: 'Las funciones están bien integradas.' },
  { key: 'q6', text: 'Encontré demasiada inconsistencia en el sitio.' },
  { key: 'q7', text: 'La mayoría de personas aprendería a usarlo rápidamente.' },
  { key: 'q8', text: 'Me pareció incómodo de usar.' },
  { key: 'q9', text: 'Me sentí seguro/a usando el sitio.' },
  { key: 'q10', text: 'Necesité aprender muchas cosas antes de poder usarlo.' },
];

@Component({
  selector: 'app-sus-feedback-widget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      @if (submitted()) {
        <div class="py-6 text-center">
          <p class="text-lg font-bold text-marino-900">¡Gracias por tu opinión!</p>
          <p class="mt-1 text-sm text-marino-500">Tus respuestas nos ayudan a mejorar la plataforma.</p>
        </div>
      } @else {
        <h3 class="text-lg font-bold text-marino-900">Ayúdanos a mejorar</h3>
        <p class="mt-1 text-sm text-marino-500">Califica tu experiencia en el sitio (1 = muy en desacuerdo, 5 = muy de acuerdo).</p>

        <form class="mt-5 space-y-4" [formGroup]="form" (ngSubmit)="onSubmit()">
          @for (question of questions; track question.key) {
            <div class="flex flex-col gap-2 border-b border-gray-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <span class="text-sm text-marino-800">{{ question.text }}</span>
              <div class="flex gap-1">
                @for (value of [1, 2, 3, 4, 5]; track value) {
                  <label class="cursor-pointer">
                    <input type="radio" class="peer sr-only" [formControlName]="question.key" [value]="value" />
                    <span class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-xs font-semibold text-marino-600 peer-checked:border-naranja-500 peer-checked:bg-naranja-500 peer-checked:text-white">
                      {{ value }}
                    </span>
                  </label>
                }
              </div>
            </div>
          }

          <div>
            <label class="mb-1 block text-sm font-medium text-marino-800">Tu nombre (opcional)</label>
            <input type="text" formControlName="respondentName" class="input-field" />
          </div>

          @if (errorMessage()) {
            <div class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage() }}</div>
          }

          <button type="submit" class="btn-primary w-full" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Enviando...' : 'Enviar opinión' }}
          </button>
        </form>
      }
    </div>
  `,
})
export class SusFeedbackWidgetComponent {
  readonly questions = QUESTIONS;
  readonly submitted = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    q1: [null as number | null, Validators.required],
    q2: [null as number | null, Validators.required],
    q3: [null as number | null, Validators.required],
    q4: [null as number | null, Validators.required],
    q5: [null as number | null, Validators.required],
    q6: [null as number | null, Validators.required],
    q7: [null as number | null, Validators.required],
    q8: [null as number | null, Validators.required],
    q9: [null as number | null, Validators.required],
    q10: [null as number | null, Validators.required],
    respondentName: [''],
  });

  constructor(private readonly susEvaluationService: SusEvaluationService) {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Por favor responde todas las preguntas.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const raw = this.form.getRawValue();
    this.susEvaluationService
      .submit({
        respondentName: raw.respondentName || undefined,
        q1: raw.q1!,
        q2: raw.q2!,
        q3: raw.q3!,
        q4: raw.q4!,
        q5: raw.q5!,
        q6: raw.q6!,
        q7: raw.q7!,
        q8: raw.q8!,
        q9: raw.q9!,
        q10: raw.q10!,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.submitted.set(true);
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('No se pudo enviar tu opinión. Inténtalo nuevamente.');
        },
      });
  }
}
