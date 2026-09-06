import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus, Prisma, Role } from '@prisma/client';
import { DIRECTOR_AREA_MAP } from '../common/enums/area-role.map';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { CreateApplicationDto } from './dto/create-application.dto';
import { FilterApplicationsDto } from './dto/filter-applications.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

const ALLOWED_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  [ApplicationStatus.PENDIENTE]: [ApplicationStatus.EN_REVISION],
  [ApplicationStatus.EN_REVISION]: [ApplicationStatus.ACEPTADO, ApplicationStatus.RECHAZADO],
  [ApplicationStatus.ACEPTADO]: [],
  [ApplicationStatus.RECHAZADO]: [],
};

const REVIEWER_SELECT = {
  select: { id: true, fullName: true, email: true, role: true },
};

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateApplicationDto, file: Express.Multer.File | undefined, postulanteId: string) {
    if (!file) {
      throw new BadRequestException('Debes adjuntar tu CV en formato PDF');
    }

    const { path, fileName } = await this.storageService.uploadPdf(file, `cv/${postulanteId}`);

    return this.prisma.application.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        dni: dto.dni,
        birthDate: dto.birthDate,
        area: dto.area,
        motivation: dto.motivation,
        availability: dto.availability,
        cvUrl: path,
        cvFileName: fileName,
        status: ApplicationStatus.PENDIENTE,
        postulanteId,
      },
    });
  }

  async findMine(postulanteId: string) {
    return this.prisma.application.findMany({
      where: { postulanteId },
      orderBy: { createdAt: 'desc' },
      include: { reviewedBy: REVIEWER_SELECT },
    });
  }

  async findAllForDirector(user: AuthenticatedUser, filters: FilterApplicationsDto) {
    const where: Prisma.ApplicationWhereInput = {};

    if (user.role === Role.DIRECTOR_GENERAL) {
      if (filters.area) where.area = filters.area;
    } else {
      const area = DIRECTOR_AREA_MAP[user.role];
      if (!area) {
        throw new ForbiddenException('Tu rol no tiene un area de voluntariado asignada');
      }
      where.area = area;
    }

    if (filters.status) where.status = filters.status;

    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { dni: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { reviewedBy: REVIEWER_SELECT },
    });
  }

  async getMetrics(user: AuthenticatedUser) {
    const where: Prisma.ApplicationWhereInput = {};
    if (user.role !== Role.DIRECTOR_GENERAL) {
      const area = DIRECTOR_AREA_MAP[user.role];
      if (!area) {
        throw new ForbiddenException('Tu rol no tiene un area de voluntariado asignada');
      }
      where.area = area;
    }

    const [total, pendientes, enRevision, aceptadas, rechazadas] = await Promise.all([
      this.prisma.application.count({ where }),
      this.prisma.application.count({ where: { ...where, status: ApplicationStatus.PENDIENTE } }),
      this.prisma.application.count({ where: { ...where, status: ApplicationStatus.EN_REVISION } }),
      this.prisma.application.count({ where: { ...where, status: ApplicationStatus.ACEPTADO } }),
      this.prisma.application.count({ where: { ...where, status: ApplicationStatus.RECHAZADO } }),
    ]);

    const resueltas = aceptadas + rechazadas;
    const tasaConversion = total > 0 ? Number(((aceptadas / total) * 100).toFixed(2)) : 0;
    const tasaAceptacionSobreResueltas =
      resueltas > 0 ? Number(((aceptadas / resueltas) * 100).toFixed(2)) : 0;

    return {
      total,
      pendientes,
      enRevision,
      aceptadas,
      rechazadas,
      tasaConversion,
      tasaAceptacionSobreResueltas,
    };
  }

  async findOne(id: string, user: AuthenticatedUser) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { reviewedBy: REVIEWER_SELECT },
    });

    if (!application) {
      throw new NotFoundException('Postulacion no encontrada');
    }

    this.assertCanAccess(application, user);
    return application;
  }

  async getCvSignedUrl(id: string, user: AuthenticatedUser) {
    const application = await this.findOne(id, user);
    const signedUrl = await this.storageService.getSignedUrl(application.cvUrl);
    return { signedUrl, fileName: application.cvFileName };
  }

  async updateStatus(id: string, dto: UpdateStatusDto, user: AuthenticatedUser) {
    const application = await this.prisma.application.findUnique({ where: { id } });
    if (!application) {
      throw new NotFoundException('Postulacion no encontrada');
    }

    this.assertCanReview(application, user);

    const allowedNext = ALLOWED_TRANSITIONS[application.status];
    if (!allowedNext.includes(dto.status)) {
      throw new BadRequestException(
        `No se puede pasar de ${application.status} a ${dto.status}. Transiciones permitidas: ${
          allowedNext.length ? allowedNext.join(', ') : 'ninguna (estado final)'
        }`,
      );
    }

    if (dto.status === ApplicationStatus.RECHAZADO && !dto.feedback) {
      throw new BadRequestException('Debes indicar un feedback al rechazar una postulacion');
    }

    const updated = await this.prisma.application.update({
      where: { id },
      data: {
        status: dto.status,
        feedback: dto.feedback ?? application.feedback,
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
      include: { reviewedBy: REVIEWER_SELECT },
    });

    await this.emailService.sendStatusUpdateEmail(
      updated.email,
      updated.fullName,
      updated.status,
      updated.feedback,
    );

    return updated;
  }

  private assertCanAccess(
    application: { postulanteId: string; area: string },
    user: AuthenticatedUser,
  ) {
    if (user.role === Role.POSTULANTE) {
      if (application.postulanteId !== user.id) {
        throw new ForbiddenException('No tienes acceso a esta postulacion');
      }
      return;
    }
    this.assertCanReview(application, user);
  }

  private assertCanReview(application: { area: string }, user: AuthenticatedUser) {
    if (user.role === Role.DIRECTOR_GENERAL) return;

    const area = DIRECTOR_AREA_MAP[user.role];
    if (!area || area !== application.area) {
      throw new ForbiddenException('No tienes acceso a postulaciones de esta area');
    }
  }
}
