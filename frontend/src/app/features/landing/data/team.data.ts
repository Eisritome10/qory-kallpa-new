export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: 'Fundación' | 'Dirección de Área';
  bio: string;
  initials: string;
  colorClass: string;
  photoUrl?: string;
}

/**
 * PLACEHOLDER: los bios de fundadores y de direcciones de área aún deben completarse
 * con la información real de cada persona. Agrega "photoUrl" (ruta en /assets) cuando
 * tengas la foto; si se omite, se muestra un avatar con las iniciales.
 */
export const FOUNDERS: TeamMember[] = [
  {
    id: 'jose-manuel-quispe',
    name: 'José Manuel Quispe Huanca',
    role: 'Fundador · Dirección General',
    category: 'Fundación',
    bio: 'Comparte aquí su trayectoria, motivación y visión para Qori Kallpa.',
    initials: 'JQ',
    colorClass: 'bg-naranja-500',
  },
  {
    id: 'heidi-briyit-quispe',
    name: 'Heidi Briyit Quispe Hinojosa',
    role: 'Fundadora · Dirección General',
    category: 'Fundación',
    bio: 'Comparte aquí su trayectoria, motivación y visión para Qori Kallpa.',
    initials: 'HQ',
    colorClass: 'bg-marino-700',
  },
  {
    id: 'luz',
    name: 'Luz (apellido pendiente)',
    role: 'Fundadora · Dirección General',
    category: 'Fundación',
    bio: 'Comparte aquí su trayectoria, motivación y visión para Qori Kallpa.',
    initials: 'LU',
    colorClass: 'bg-naranja-600',
  },
];

export const AREA_DIRECTORS: TeamMember[] = [
  {
    id: 'alianzas',
    name: 'Heidi Briyit Quispe Hinojosa',
    role: 'Directora de Alianzas y Recaudación',
    category: 'Dirección de Área',
    bio: 'Comparte aquí su trayectoria y su rol construyendo alianzas estratégicas.',
    initials: 'NA',
    colorClass: 'bg-marino-600',
  },
  {
    id: 'tecnologia',
    name: 'Emanuel Israel Rios Torres',
    role: 'Director de Tecnología y Sistemas',
    category: 'Dirección de Área',
    bio: 'Líder de desarrollo de la plataforma web de Qori Kallpa y las herramientas digitales de la ONG.',
    initials: 'ER',
    photoUrl: 'assets/emanuel-rios.png',
    colorClass: 'bg-marino-700',
  },
  {
    id: 'supervision',
    name: 'Nombre y Apellido',
    role: 'Dirección de Supervisión de Proyectos',
    category: 'Dirección de Área',
    bio: 'Comparte aquí su enfoque para asegurar la calidad e impacto de los proyectos.',
    initials: 'NA',
    colorClass: 'bg-naranja-600',
  },
  {
    id: 'programas',
    name: 'Nombre y Apellido',
    role: 'Dirección de Programas',
    category: 'Dirección de Área',
    bio: 'Comparte aquí su trayectoria diseñando programas de impacto social.',
    initials: 'NA',
    colorClass: 'bg-marino-800',
  },
  {
    id: 'eventos',
    name: 'Nombre y Apellido',
    role: 'Dirección de Eventos',
    category: 'Dirección de Área',
    bio: 'Comparte aquí su experiencia organizando actividades comunitarias.',
    initials: 'NA',
    colorClass: 'bg-naranja-500',
  },
  {
    id: 'marketing',
    name: 'Nombre y Apellido',
    role: 'Dirección de Marketing',
    category: 'Dirección de Área',
    bio: 'Comparte aquí su visión de comunicación para dar voz a nuestras causas.',
    initials: 'NA',
    colorClass: 'bg-marino-600',
  },
  {
    id: 'gestion-humana',
    name: 'Heidi Briyit Quispe Hinojosa',
    role: 'Directora de Gestión Humana',
    category: 'Dirección de Área',
    bio: 'Comparte aquí su compromiso acompañando a cada voluntario/a de la ONG.',
    initials: 'NA',
    colorClass: 'bg-marino-700',
  },
];
