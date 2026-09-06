export type AreaVoluntariado =
  | 'ALIANZAS_RECAUDACION'
  | 'TECNOLOGIA_SISTEMAS'
  | 'SUPERVISION_PROYECTOS'
  | 'PROGRAMAS'
  | 'EVENTOS'
  | 'MARKETING'
  | 'GESTION_HUMANA';

export const AREA_LABELS: Record<AreaVoluntariado, string> = {
  ALIANZAS_RECAUDACION: 'Alianzas y Recaudacion',
  TECNOLOGIA_SISTEMAS: 'Tecnologia y Sistemas',
  SUPERVISION_PROYECTOS: 'Supervision de Proyectos',
  PROGRAMAS: 'Programas',
  EVENTOS: 'Eventos',
  MARKETING: 'Marketing',
  GESTION_HUMANA: 'Gestion Humana',
};

export type ApplicationStatus = 'PENDIENTE' | 'EN_REVISION' | 'ACEPTADO' | 'RECHAZADO';

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDIENTE: 'Pendiente',
  EN_REVISION: 'En revision',
  ACEPTADO: 'Aceptado',
  RECHAZADO: 'Rechazado',
};

export const STATUS_BADGE_CLASSES: Record<ApplicationStatus, string> = {
  PENDIENTE: 'bg-gray-100 text-gray-700 ring-gray-300',
  EN_REVISION: 'bg-amber-100 text-amber-800 ring-amber-300',
  ACEPTADO: 'bg-emerald-100 text-emerald-800 ring-emerald-300',
  RECHAZADO: 'bg-red-100 text-red-700 ring-red-300',
};

export interface ReviewerSummary {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface VolunteerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dni: string;
  birthDate: string;
  area: AreaVoluntariado;
  motivation: string;
  availability: string;
  cvUrl: string;
  cvFileName: string;
  status: ApplicationStatus;
  feedback: string | null;
  postulanteId: string;
  reviewedBy: ReviewerSummary | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationMetrics {
  total: number;
  pendientes: number;
  enRevision: number;
  aceptadas: number;
  rechazadas: number;
  tasaConversion: number;
  tasaAceptacionSobreResueltas: number;
}

export interface ApplicationFilters {
  status?: ApplicationStatus;
  area?: AreaVoluntariado;
  search?: string;
}
