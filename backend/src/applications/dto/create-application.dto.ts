import { AreaVoluntariado } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsString, Matches, MinLength } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @MinLength(3)
  fullName: string;

  @IsEmail()
  email: string;

  @Matches(/^[0-9+\s-]{6,15}$/, { message: 'El telefono no tiene un formato valido' })
  phone: string;

  @Matches(/^[0-9A-Za-z]{6,12}$/, { message: 'El DNI/documento no tiene un formato valido' })
  dni: string;

  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento no es valida' })
  birthDate: Date;

  @IsEnum(AreaVoluntariado, { message: 'El area de voluntariado no es valida' })
  area: AreaVoluntariado;

  @IsString()
  @MinLength(20, { message: 'Cuentanos un poco mas sobre tu motivacion (minimo 20 caracteres)' })
  motivation: string;

  @IsString()
  @MinLength(3)
  availability: string;
}
