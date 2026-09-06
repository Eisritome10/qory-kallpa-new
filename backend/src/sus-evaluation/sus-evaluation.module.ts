import { Module } from '@nestjs/common';
import { SusEvaluationController } from './sus-evaluation.controller';
import { SusEvaluationService } from './sus-evaluation.service';

@Module({
  controllers: [SusEvaluationController],
  providers: [SusEvaluationService],
})
export class SusEvaluationModule {}
