import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PATRON_NOMBRE } from '../colas/crear-cola.dto.js';

export class BindingDto {
  @IsString({ message: 'exchange debe ser un texto' })
  @MinLength(1, { message: 'exchange no puede estar vacio' })
  @MaxLength(100, { message: 'exchange no puede pasar de 100 caracteres' })
  @Matches(PATRON_NOMBRE, { message: 'exchange tiene caracteres no validos' })
  exchange!: string;

  @IsString({ message: 'cola debe ser un texto' })
  @MinLength(1, { message: 'cola no puede estar vacia' })
  @MaxLength(100, { message: 'cola no puede pasar de 100 caracteres' })
  @Matches(PATRON_NOMBRE, { message: 'cola tiene caracteres no validos' })
  cola!: string;

  @IsString({ message: 'routingKey debe ser un texto' })
  @MinLength(1, { message: 'routingKey no puede estar vacia' })
  @MaxLength(255, { message: 'routingKey no puede pasar de 255 caracteres' })
  routingKey!: string;
}