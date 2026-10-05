import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export const PATRON_NOMBRE = /^[A-Za-z0-9._-]+$/;

export class CrearColaDto {
  @IsString({ message: 'nombre debe ser un texto' })
  @MinLength(1, { message: 'nombre no puede estar vacio' })
  @MaxLength(100, { message: 'nombre no puede pasar de 100 caracteres' })
  @Matches(PATRON_NOMBRE, {
    message: 'nombre solo admite letras, numeros, punto, guion y guion bajo, sin espacios',
  })
  nombre!: string;

  @IsBoolean({ message: 'durable debe ser true o false' })
  durable: boolean = true;

  @IsOptional()
  @IsIn(['classic', 'quorum'], { message: 'tipo debe ser classic o quorum' })
  tipo?: 'classic' | 'quorum';

  @IsOptional()
  @IsString({ message: 'deadLetterExchange debe ser un texto' })
  @Matches(PATRON_NOMBRE, { message: 'deadLetterExchange tiene caracteres no validos' })
  deadLetterExchange?: string;

  @IsOptional()
  @IsInt({ message: 'maxLength debe ser un entero' })
  @Min(1, { message: 'maxLength debe ser al menos 1' })
  @Max(1000000, { message: 'maxLength no puede pasar de 1000000' })
  maxLength?: number;
}