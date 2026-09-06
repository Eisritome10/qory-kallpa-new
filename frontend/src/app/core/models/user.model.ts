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
  DIRECTOR_GENERAL: 'Direccion General',
  DIRECTOR_ALIANZAS_RECAUDACION: 'Direccion de Alianzas y Recaudacion',
  DIRECTOR_TECNOLOGIA_SISTEMAS: 'Direccion de Tecnologia y Sistemas',
  DIRECTOR_SUPERVISION_PROYECTOS: 'Direccion de Supervision de Proyectos',
  DIRECTOR_PROGRAMAS: 'Direccion de Programas',
  DIRECTOR_EVENTOS: 'Direccion de Eventos',
  DIRECTOR_MARKETING: 'Direccion de Marketing',
  DIRECTOR_GESTION_HUMANA: 'Direccion de Gestion Humana',
};

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
