import { AreaVoluntariado, Role } from '@prisma/client';

/**
 * Relaciona cada rol de Director con el área funcional de Qori Kallpa que gestiona.
 * DIRECTOR_GENERAL no aparece aquí: se le trata como acceso a todas las áreas.
 */
export const DIRECTOR_AREA_MAP: Partial<Record<Role, AreaVoluntariado>> = {
  [Role.DIRECTOR_ALIANZAS_RECAUDACION]: AreaVoluntariado.ALIANZAS_RECAUDACION,
  [Role.DIRECTOR_TECNOLOGIA_SISTEMAS]: AreaVoluntariado.TECNOLOGIA_SISTEMAS,
  [Role.DIRECTOR_SUPERVISION_PROYECTOS]: AreaVoluntariado.SUPERVISION_PROYECTOS,
  [Role.DIRECTOR_PROGRAMAS]: AreaVoluntariado.PROGRAMAS,
  [Role.DIRECTOR_EVENTOS]: AreaVoluntariado.EVENTOS,
  [Role.DIRECTOR_MARKETING]: AreaVoluntariado.MARKETING,
  [Role.DIRECTOR_GESTION_HUMANA]: AreaVoluntariado.GESTION_HUMANA,
};

export const DIRECTOR_ROLES: Role[] = [
  Role.DIRECTOR_GENERAL,
  Role.DIRECTOR_ALIANZAS_RECAUDACION,
  Role.DIRECTOR_TECNOLOGIA_SISTEMAS,
  Role.DIRECTOR_SUPERVISION_PROYECTOS,
  Role.DIRECTOR_PROGRAMAS,
  Role.DIRECTOR_EVENTOS,
  Role.DIRECTOR_MARKETING,
  Role.DIRECTOR_GESTION_HUMANA,
];
