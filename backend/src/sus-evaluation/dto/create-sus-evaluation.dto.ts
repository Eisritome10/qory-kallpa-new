import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

const scoreOptions = { message: 'Cada respuesta debe ser un entero entre 1 y 5' };

export class CreateSusEvaluationDto {
  @IsOptional()
  @IsString()
  respondentName?: string;

  @IsOptional()
  @IsUUID()
  applicationId?: string;

  @IsInt(scoreOptions) @Min(1) @Max(5) q1: number;
  @IsInt(scoreOptions) @Min(1) @Max(5) q2: number;
  @IsInt(scoreOptions) @Min(1) @Max(5) q3: number;
  @IsInt(scoreOptions) @Min(1) @Max(5) q4: number;
  @IsInt(scoreOptions) @Min(1) @Max(5) q5: number;
  @IsInt(scoreOptions) @Min(1) @Max(5) q6: number;
  @IsInt(scoreOptions) @Min(1) @Max(5) q7: number;
  @IsInt(scoreOptions) @Min(1) @Max(5) q8: number;
  @IsInt(scoreOptions) @Min(1) @Max(5) q9: number;
  @IsInt(scoreOptions) @Min(1) @Max(5) q10: number;
}

export const SUS_QUESTION_KEYS = [
  'q1',
  'q2',
  'q3',
  'q4',
  'q5',
  'q6',
  'q7',
  'q8',
  'q9',
  'q10',
] as const;
