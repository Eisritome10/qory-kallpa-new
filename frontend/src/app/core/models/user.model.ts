export type Role =
  | 'POSTULANTE'
  | 'DIRECTOR_GENERAL'
  | 'DIRECTOR_ALIANZAS_RECAUDACION'
  | 'DIRECTOR_TECNOLOGIA_SISTEMAS'
  | 'DIRECTOR_SUPERVISION_PROYECTOS'
  | 'DIRECTOR_PROGRAMAS'
  | 'DIRECTOR_EVENTOS'
  | 'DIRECTOR_MARKETING'
  | 'DIRECTOR_GESTION_HUMANA';

export const DIRECTOR_ROLES: Role[] = [
  'DIRECTOR_GENERAL',
  'DIRECTOR_ALIANZAS_RECAUDACION',
  'DIRECTOR_TECNOLOGIA_SISTEMAS',
  'DIRECTOR_SUPERVISION_PROYECTOS',
  'DIRECTOR_PROGRAMAS',
  'DIRECTOR_EVENTOS',
  'DIRECTOR_MARKETING',
  'DIRECTOR_GESTION_HUMANA',
];

export const ROLE_LABELS: Record<Role, string> = {
  POSTULANTE: 'Postulante',
  DIRECTOR_GENERAL: 'Dirección General',
  DIRECTOR_ALIANZAS_RECAUDACION: 'Dirección de Alianzas y Recaudación',
  DIRECTOR_TECNOLOGIA_SISTEMAS: 'Dirección de Tecnología y Sistemas',
  DIRECTOR_SUPERVISION_PROYECTOS: 'Dirección de Supervisión de Proyectos',
  DIRECTOR_PROGRAMAS: 'Dirección de Programas',
  DIRECTOR_EVENTOS: 'Dirección de Eventos',
  DIRECTOR_MARKETING: 'Dirección de Marketing',
  DIRECTOR_GESTION_HUMANA: 'Dirección de Gestión Humana',
};

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  avatarUrl?: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  dni: string | null;
  birthDate: string | null;
  avatarUrl: string | null;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
