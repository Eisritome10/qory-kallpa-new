import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'QoriKallpa2025!';

const directors: { fullName: string; email: string; role: Role }[] = [
  { fullName: 'Dirección General', email: 'direccion.general@qorikallpa.org', role: Role.DIRECTOR_GENERAL },
  {
    fullName: 'Directora de Alianzas y Recaudación',
    email: 'alianzas@qorikallpa.org',
    role: Role.DIRECTOR_ALIANZAS_RECAUDACION,
  },
  {
    fullName: 'Director de Tecnología y Sistemas',
    email: 'tecnologia@qorikallpa.org',
    role: Role.DIRECTOR_TECNOLOGIA_SISTEMAS,
  },
  {
    fullName: 'Directora de Supervisión de Proyectos',
    email: 'supervision.proyectos@qorikallpa.org',
    role: Role.DIRECTOR_SUPERVISION_PROYECTOS,
  },
  { fullName: 'Directora de Programas', email: 'programas@qorikallpa.org', role: Role.DIRECTOR_PROGRAMAS },
  { fullName: 'Director de Eventos', email: 'eventos@qorikallpa.org', role: Role.DIRECTOR_EVENTOS },
  { fullName: 'Directora de Marketing', email: 'marketing@qorikallpa.org', role: Role.DIRECTOR_MARKETING },
  {
    fullName: 'Directora de Gestión Humana',
    email: 'gestion.humana@qorikallpa.org',
    role: Role.DIRECTOR_GESTION_HUMANA,
  },
];

async function main() {
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  for (const director of directors) {
    await prisma.user.upsert({
      where: { email: director.email },
      update: { fullName: director.fullName, isEmailVerified: true, isActive: true },
      create: {
        fullName: director.fullName,
        email: director.email,
        password: hashedPassword,
        role: director.role,
        isActive: true,
        isEmailVerified: true,
      },
    });
    console.log(`Usuario listo: ${director.email} (${director.role})`);
  }

  console.log('\nContraseña para todos los directores de prueba:', DEFAULT_PASSWORD);
  console.log('Cambia estas contraseñas antes de pasar a producción.');
}

main()
  .catch((error) => {
    console.error('Error al ejecutar el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
