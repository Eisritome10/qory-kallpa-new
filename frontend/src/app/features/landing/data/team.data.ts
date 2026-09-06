export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: 'Fundacion' | 'Direccion de Area';
  bio: string;
  initials: string;
  colorClass: string;
}

/**
 * PLACEHOLDER: los bios de fundadores y de direcciones de area aun deben completarse
 * con la informacion real de cada persona (y su foto, cuando este disponible).
 */
export const FOUNDERS: TeamMember[] = [
  {
    id: 'jose-manuel-quispe',
    name: 'Jose Manuel Quispe Huanca',
    role: 'Fundador · Direccion General',
    category: 'Fundacion',
    bio: 'Comparte aqui su trayectoria, motivacion y vision para Qori Kallpa.',
    initials: 'JQ',
    colorClass: 'bg-naranja-500',
  },
  {
    id: 'heidi-briyit-quispe',
    name: 'Heidi Briyit Quispe Hinojosa',
    role: 'Fundadora · Direccion General',
    category: 'Fundacion',
    bio: 'Comparte aqui su trayectoria, motivacion y vision para Qori Kallpa.',
    initials: 'HQ',
    colorClass: 'bg-marino-700',
  },
  {
    id: 'luz',
    name: 'Luz (apellido pendiente)',
    role: 'Fundadora · Direccion General',
    category: 'Fundacion',
    bio: 'Comparte aqui su trayectoria, motivacion y vision para Qori Kallpa.',
    initials: 'LU',
    colorClass: 'bg-naranja-600',
  },
];

export const AREA_DIRECTORS: TeamMember[] = [
  {
    id: 'alianzas',
    name: 'Nombre y Apellido',
    role: 'Direccion de Alianzas y Recaudacion',
    category: 'Direccion de Area',
    bio: 'Comparte aqui su trayectoria y su rol construyendo alianzas estrategicas.',
    initials: 'NA',
    colorClass: 'bg-marino-600',
  },
  {
    id: 'tecnologia',
    name: 'Nombre y Apellido',
    role: 'Direccion de Tecnologia y Sistemas',
    category: 'Direccion de Area',
    bio: 'Comparte aqui su experiencia liderando las herramientas digitales de la ONG.',
    initials: 'NA',
    colorClass: 'bg-marino-700',
  },
  {
    id: 'supervision',
    name: 'Nombre y Apellido',
    role: 'Direccion de Supervision de Proyectos',
    category: 'Direccion de Area',
    bio: 'Comparte aqui su enfoque para asegurar la calidad e impacto de los proyectos.',
    initials: 'NA',
    colorClass: 'bg-naranja-600',
  },
  {
    id: 'programas',
    name: 'Nombre y Apellido',
    role: 'Direccion de Programas',
    category: 'Direccion de Area',
    bio: 'Comparte aqui su trayectoria disenando programas de impacto social.',
    initials: 'NA',
    colorClass: 'bg-marino-800',
  },
  {
    id: 'eventos',
    name: 'Nombre y Apellido',
    role: 'Direccion de Eventos',
    category: 'Direccion de Area',
    bio: 'Comparte aqui su experiencia organizando actividades comunitarias.',
    initials: 'NA',
    colorClass: 'bg-naranja-500',
  },
  {
    id: 'marketing',
    name: 'Nombre y Apellido',
    role: 'Direccion de Marketing',
    category: 'Direccion de Area',
    bio: 'Comparte aqui su vision de comunicacion para dar voz a nuestras causas.',
    initials: 'NA',
    colorClass: 'bg-marino-600',
  },
  {
    id: 'gestion-humana',
    name: 'Nombre y Apellido',
    role: 'Direccion de Gestion Humana',
    category: 'Direccion de Area',
    bio: 'Comparte aqui su compromiso acompanando a cada voluntario/a de la ONG.',
    initials: 'NA',
    colorClass: 'bg-marino-700',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [...FOUNDERS, ...AREA_DIRECTORS];
