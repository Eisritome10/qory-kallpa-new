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
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './strategies/jwt.strategy';

const SALT_ROUNDS = 10;
const EMAIL_VERIFICATION_EXPIRES_IN = '24h';
const EMAIL_VERIFICATION_PURPOSE = 'email-verification';
const PASSWORD_RESET_EXPIRES_IN = '1h';
const PASSWORD_RESET_PURPOSE = 'password-reset';

interface EmailVerificationPayload {
  sub: string;
  purpose: typeof EMAIL_VERIFICATION_PURPOSE;
}

interface PasswordResetPayload {
  sub: string;
  purpose: typeof PASSWORD_RESET_PURPOSE;
}

interface UserForAuthResponse {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  avatarUrl: string | null;
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
        phone: dto.phone,
        dni: dto.dni,
        birthDate: dto.birthDate,
        role: Role.POSTULANTE,
        isEmailVerified: false,
      },
    });

    await this.sendVerificationEmail(user.id, user.email, user.fullName);

    return {
      message: 'Cuenta creada. Revisa tu correo electrónico para verificar tu cuenta antes de ingresar.',
      email: user.email,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException('Debes verificar tu correo electrónico antes de iniciar sesión');
    }

    return this.buildAuthResponse(user);
  }

  async verifyEmail(token: string) {
    let payload: EmailVerificationPayload;
    try {
      payload = this.jwtService.verify<EmailVerificationPayload>(token);
    } catch {
      throw new BadRequestException('El enlace de verificación no es válido o expiró');
    }

    if (payload.purpose !== EMAIL_VERIFICATION_PURPOSE) {
      throw new BadRequestException('El enlace de verificación no es válido');
    }

    const user = await this.prisma.user.update({
      where: { id: payload.sub },
      data: { isEmailVerified: true },
    });

    return this.buildAuthResponse(user);
  }

  async resendVerification(email: string) {
    const genericMessage = 'Si el correo existe y no ha sido verificado, te enviamos un nuevo enlace.';
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && !user.isEmailVerified) {
      await this.sendVerificationEmail(user.id, user.email, user.fullName);
    }

    return { message: genericMessage };
  }

  async forgotPassword(email: string) {
    const genericMessage = 'Si el correo existe en nuestro sistema, te enviamos un enlace para restablecer tu contraseña.';
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && user.isActive) {
      const payload: PasswordResetPayload = { sub: user.id, purpose: PASSWORD_RESET_PURPOSE };
      const token = this.jwtService.sign(payload, { expiresIn: PASSWORD_RESET_EXPIRES_IN });
      await this.emailService.sendPasswordResetEmail(user.email, user.fullName, token);
    }

    return { message: genericMessage };
  }

  async resetPassword(dto: ResetPasswordDto) {
    let payload: PasswordResetPayload;
    try {
      payload = this.jwtService.verify<PasswordResetPayload>(dto.token);
    } catch {
      throw new BadRequestException('El enlace para restablecer tu contraseña no es válido o expiró');
    }

    if (payload.purpose !== PASSWORD_RESET_PURPOSE) {
      throw new BadRequestException('El enlace para restablecer tu contraseña no es válido');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { password: hashedPassword },
    });

    return { message: 'Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión.' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const passwordMatches = await bcrypt.compare(dto.currentPassword, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('La contraseña actual no es correcta');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Tu contraseña se actualizó correctamente.' };
  }

  private async sendVerificationEmail(userId: string, email: string, fullName: string): Promise<void> {
    const payload: EmailVerificationPayload = { sub: userId, purpose: EMAIL_VERIFICATION_PURPOSE };
    const token = this.jwtService.sign(payload, { expiresIn: EMAIL_VERIFICATION_EXPIRES_IN });
    await this.emailService.sendVerificationEmail(email, fullName, token);
  }

  private buildAuthResponse(user: UserForAuthResponse) {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
