import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { CreateSusEvaluationDto, SUS_QUESTION_KEYS } from './dto/create-sus-evaluation.dto';

@Injectable()
export class SusEvaluationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Formula estandar del System Usability Scale (Brooke, 1986):
   * items impares (1,3,5,7,9) aportan (valor - 1)
   * items pares (2,4,6,8,10) aportan (5 - valor)
   * la suma se multiplica por 2.5 para obtener un puntaje de 0 a 100.
   */
  private calculateScore(dto: CreateSusEvaluationDto): number {
    let sum = 0;
    SUS_QUESTION_KEYS.forEach((key, index) => {
      const value = dto[key];
      const isOdd = index % 2 === 0; // q1, q3, q5, q7, q9
      sum += isOdd ? value - 1 : 5 - value;
    });
    return Number((sum * 2.5).toFixed(2));
  }

  async create(dto: CreateSusEvaluationDto, evaluatedById?: string) {
    const score = this.calculateScore(dto);

    return this.prisma.susEvaluation.create({
      data: {
        respondentName: dto.respondentName,
        applicationId: dto.applicationId,
        q1: dto.q1,
        q2: dto.q2,
        q3: dto.q3,
        q4: dto.q4,
        q5: dto.q5,
        q6: dto.q6,
        q7: dto.q7,
        q8: dto.q8,
        q9: dto.q9,
        q10: dto.q10,
        score,
        evaluatedById,
      },
    });
  }

  async findAll() {
    return this.prisma.susEvaluation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { evaluatedBy: { select: { id: true, fullName: true } } },
    });
  }

  async getStats() {
    const evaluations = await this.prisma.susEvaluation.findMany({ select: { score: true } });

    if (evaluations.length === 0) {
      return { count: 0, averageScore: 0, interpretation: 'Sin datos suficientes' };
    }

    const averageScore = Number(
      (evaluations.reduce((acc, e) => acc + e.score, 0) / evaluations.length).toFixed(2),
    );

    return {
      count: evaluations.length,
      averageScore,
      interpretation: this.interpretScore(averageScore),
    };
  }

  private interpretScore(score: number): string {
    if (score >= 80.3) return 'Excelente';
    if (score >= 68) return 'Bueno';
    if (score >= 51) return 'Aceptable';
    return 'Deficiente';
  }
}
