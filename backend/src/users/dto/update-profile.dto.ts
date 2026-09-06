import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'El nombre completo debe tener al menos 3 caracteres' })
  fullName?: string;

  @IsOptional()
  @Matches(/^[0-9+\s-]{6,15}$/, { message: 'El teléfono no tiene un formato válido' })
  phone?: string;

  @IsOptional()
  @Matches(/^[0-9A-Za-z]{6,12}$/, { message: 'El DNI/documento no tiene un formato válido' })
  dni?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento no es válida' })
  birthDate?: Date;
}
