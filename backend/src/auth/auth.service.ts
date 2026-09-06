import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';

const SALT_ROUNDS = 10;
const EMAIL_VERIFICATION_EXPIRES_IN = '24h';
const EMAIL_VERIFICATION_PURPOSE = 'email-verification';

interface EmailVerificationPayload {
  sub: string;
  purpose: typeof EMAIL_VERIFICATION_PURPOSE;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Ya existe una cuenta registrada con este correo');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
        role: Role.POSTULANTE,
        isEmailVerified: false,
      },
    });

    await this.sendVerificationEmail(user.id, user.email, user.fullName);

    return {
      message: 'Cuenta creada. Revisa tu correo electronico para verificar tu cuenta antes de ingresar.',
      email: user.email,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException('Debes verificar tu correo electronico antes de iniciar sesion');
    }

    return this.buildAuthResponse(user.id, user.email, user.fullName, user.role);
  }

  async verifyEmail(token: string) {
    let payload: EmailVerificationPayload;
    try {
      payload = this.jwtService.verify<EmailVerificationPayload>(token);
    } catch {
      throw new BadRequestException('El enlace de verificacion no es valido o expiro');
    }

    if (payload.purpose !== EMAIL_VERIFICATION_PURPOSE) {
      throw new BadRequestException('El enlace de verificacion no es valido');
    }

    const user = await this.prisma.user.update({
      where: { id: payload.sub },
      data: { isEmailVerified: true },
    });

    return this.buildAuthResponse(user.id, user.email, user.fullName, user.role);
  }

  async resendVerification(email: string) {
    const genericMessage = 'Si el correo existe y no ha sido verificado, te enviamos un nuevo enlace.';
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && !user.isEmailVerified) {
      await this.sendVerificationEmail(user.id, user.email, user.fullName);
    }

    return { message: genericMessage };
  }

  private async sendVerificationEmail(userId: string, email: string, fullName: string): Promise<void> {
    const payload: EmailVerificationPayload = { sub: userId, purpose: EMAIL_VERIFICATION_PURPOSE };
    const token = this.jwtService.sign(payload, { expiresIn: EMAIL_VERIFICATION_EXPIRES_IN });
    await this.emailService.sendVerificationEmail(email, fullName, token);
  }

  private buildAuthResponse(id: string, email: string, fullName: string, role: Role) {
    const payload: JwtPayload = { sub: id, email, role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id, email, fullName, role },
    };
  }
}
