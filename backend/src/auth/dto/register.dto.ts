import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @Matches(/^[0-9+\s-]{6,15}$/, { message: 'El teléfono no tiene un formato válido' })
  phone: string;

  @Matches(/^[0-9A-Za-z]{6,12}$/, { message: 'El DNI/documento no tiene un formato válido' })
  dni: string;

  @Type(() => Date)
  @IsDate({ message: 'La fecha de nacimiento no es válida' })
  birthDate: Date;
}
