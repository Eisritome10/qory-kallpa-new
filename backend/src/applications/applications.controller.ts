import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { DIRECTOR_ROLES } from '../common/enums/area-role.map';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { pdfUploadOptions } from '../storage/pdf-upload.options';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { FilterApplicationsDto } from './dto/filter-applications.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Roles(Role.POSTULANTE)
  @Post()
  @UseInterceptors(FileInterceptor('cv', pdfUploadOptions))
  create(
    @Body() dto: CreateApplicationDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.applicationsService.create(dto, file, user.id);
  }

  @Roles(Role.POSTULANTE)
  @Get('me')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.applicationsService.findMine(user.id);
  }

  @Roles(...DIRECTOR_ROLES)
  @Get()
  findAll(@Query() filters: FilterApplicationsDto, @CurrentUser() user: AuthenticatedUser) {
    return this.applicationsService.findAllForDirector(user, filters);
  }

  @Roles(...DIRECTOR_ROLES)
  @Get('metrics')
  getMetrics(@CurrentUser() user: AuthenticatedUser) {
    return this.applicationsService.getMetrics(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.applicationsService.findOne(id, user);
  }

  @Get(':id/cv')
  getCv(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.applicationsService.getCvSignedUrl(id, user);
  }

  @Roles(...DIRECTOR_ROLES)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.applicationsService.updateStatus(id, dto, user);
  }
}
