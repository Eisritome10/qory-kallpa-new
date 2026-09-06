import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { ApplicationStatus } from '@prisma/client';

const BRAND_COLOR = '#0f2843';
const ACCENT_COLOR = '#f8621a';

const STATUS_COPY: Record<ApplicationStatus, { title: string; body: string }> = {
  PENDIENTE: {
    title: 'Hemos recibido tu postulacion',
    body: 'Tu postulacion como voluntario/a fue registrada y esta pendiente de revision.',
  },
  EN_REVISION: {
    title: 'Tu postulacion esta en revision',
    body: 'El equipo del area esta revisando tu postulacion. Te avisaremos en cuanto haya una decision.',
  },
  ACEPTADO: {
    title: 'Felicidades, fuiste aceptado/a',
    body: 'Tu postulacion como voluntario/a de Qori Kallpa fue aceptada. Pronto nos pondremos en contacto contigo para los siguientes pasos.',
  },
  RECHAZADO: {
    title: 'Actualizacion sobre tu postulacion',
    body: 'Luego de revisar tu postulacion, en esta ocasion no continuaremos con el proceso.',
  },
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;
  private readonly fromAddress: string;
  private readonly frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.fromAddress = this.configService.get<string>('EMAIL_FROM', 'Qori Kallpa <onboarding@resend.dev>');
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:4200');

    if (!this.resend) {
      this.logger.warn('RESEND_API_KEY no configurado: los correos no se enviaran (solo se registraran en el log).');
    }
  }

  async sendVerificationEmail(to: string, fullName: string, token: string): Promise<void> {
    const verifyUrl = `${this.frontendUrl}/verificar-correo?token=${encodeURIComponent(token)}`;

    await this.send({
      to,
      subject: 'Verifica tu correo - Qori Kallpa',
      html: this.wrapTemplate(`
        <h1 style="color:${BRAND_COLOR};margin:0 0 16px;">Bienvenido/a a Qori Kallpa, ${this.escape(fullName)}</h1>
        <p>Gracias por registrarte para postular como voluntario/a. Confirma tu correo electronico para activar tu cuenta.</p>
        <p style="text-align:center;margin:32px 0;">
          <a href="${verifyUrl}" style="background:${ACCENT_COLOR};color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
            Verificar mi correo
          </a>
        </p>
        <p style="font-size:13px;color:#667085;">Si el boton no funciona, copia y pega este enlace en tu navegador:<br>${verifyUrl}</p>
        <p style="font-size:13px;color:#667085;">Este enlace expira en 24 horas.</p>
      `),
    });
  }

  async sendStatusUpdateEmail(
    to: string,
    fullName: string,
    status: ApplicationStatus,
    feedback?: string | null,
  ): Promise<void> {
    const copy = STATUS_COPY[status];

    await this.send({
      to,
      subject: `${copy.title} - Qori Kallpa`,
      html: this.wrapTemplate(`
        <h1 style="color:${BRAND_COLOR};margin:0 0 16px;">${copy.title}</h1>
        <p>Hola ${this.escape(fullName)},</p>
        <p>${copy.body}</p>
        ${
          feedback
            ? `<div style="background:#f3f4f6;border-radius:8px;padding:16px;margin:20px 0;">
                 <p style="margin:0;font-weight:600;color:${BRAND_COLOR};">Comentarios del equipo:</p>
                 <p style="margin:8px 0 0;color:#344054;">${this.escape(feedback)}</p>
               </div>`
            : ''
        }
        <p style="font-size:13px;color:#667085;">Puedes revisar el estado de tu postulacion en cualquier momento desde "Mis postulaciones" en nuestro sitio.</p>
      `),
    });
  }

  private async send(params: { to: string; subject: string; html: string }): Promise<void> {
    if (!this.resend) {
      this.logger.log(`[Email omitido - sin API key] Para: ${params.to} | Asunto: ${params.subject}`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.fromAddress,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });
    } catch (error) {
      this.logger.error(`No se pudo enviar el correo a ${params.to}: ${(error as Error).message}`);
    }
  }

  private wrapTemplate(innerHtml: string): string {
    return `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="display:inline-block;background:${BRAND_COLOR};color:${ACCENT_COLOR};font-weight:800;border-radius:9999px;width:40px;height:40px;line-height:40px;">QK</span>
          <div style="font-weight:700;color:${BRAND_COLOR};margin-top:8px;">Qori Kallpa</div>
        </div>
        ${innerHtml}
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
        <p style="font-size:12px;color:#98a2b3;text-align:center;">Qori Kallpa - Voces con Poder</p>
      </div>
    `;
  }

  private escape(value: string): string {
    return value.replace(/[&<>"']/g, (char) => {
      const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      return map[char];
    });
  }
}
