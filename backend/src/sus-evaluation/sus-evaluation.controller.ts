import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { DIRECTOR_ROLES } from '../common/enums/area-role.map';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateSusEvaluationDto } from './dto/create-sus-evaluation.dto';
import { SusEvaluationService } from './sus-evaluation.service';

@Controller('sus-evaluations')
export class SusEvaluationController {
  constructor(private readonly susEvaluationService: SusEvaluationService) {}

  /** Publico: cualquier visitante/postulante puede evaluar la usabilidad de la plataforma. */
  @Post()
  create(@Body() dto: CreateSusEvaluationDto) {
    return this.susEvaluationService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...DIRECTOR_ROLES)
  @Get()
  findAll() {
    return this.susEvaluationService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...DIRECTOR_ROLES)
  @Get('stats')
  getStats() {
    return this.susEvaluationService.getStats();
  }
}
