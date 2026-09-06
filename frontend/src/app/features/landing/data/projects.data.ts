export interface Project {
  name: string;
  area: string;
  description: string;
  gradient: string;
}

/**
 * PLACEHOLDER: reemplaza con los proyectos reales de Qori Kallpa (nombre, area,
 * descripcion e imagen). El degradado es solo un marcador visual temporal.
 */
export const PROJECTS: Project[] = [
  {
    name: 'Nombre del Proyecto 1',
    area: 'Programas',
    description: 'Describe aqui el objetivo, la comunidad beneficiada y el impacto de este proyecto.',
    gradient: 'from-marino-700 to-marino-900',
  },
  {
    name: 'Nombre del Proyecto 2',
    area: 'Eventos',
    description: 'Describe aqui el objetivo, la comunidad beneficiada y el impacto de este proyecto.',
    gradient: 'from-naranja-500 to-naranja-700',
  },
  {
    name: 'Nombre del Proyecto 3',
    area: 'Gestion Humana',
    description: 'Describe aqui el objetivo, la comunidad beneficiada y el impacto de este proyecto.',
    gradient: 'from-marino-600 to-naranja-600',
  },
];
