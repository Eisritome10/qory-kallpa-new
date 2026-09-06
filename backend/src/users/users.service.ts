import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

const PROFILE_SELECT = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  dni: true,
  birthDate: true,
  avatarUrl: true,
  role: true,
  createdAt: true,
};

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId }, select: PROFILE_SELECT });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        dni: dto.dni,
        birthDate: dto.birthDate,
      },
      select: PROFILE_SELECT,
    });
  }

  async updateAvatar(userId: string, file: Express.Multer.File | undefined) {
    if (!file) {
      throw new BadRequestException('Debes adjuntar una imagen');
    }

    const avatarUrl = await this.storageService.uploadAvatar(file, userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: PROFILE_SELECT,
    });
  }
}
