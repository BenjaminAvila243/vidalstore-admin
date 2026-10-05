import { IsBoolean, IsIn, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PATRON_NOMBRE } from '../colas/crear-cola.dto.js';

export const TIPOS_EXCHANGE = ['direct', 'topic', 'fanout', 'headers'] as const;
export type TipoExchange = (typeof TIPOS_EXCHANGE)[number];

export class CrearExchangeDto {
  @IsString({ message: 'nombre debe ser un texto' })
  @MinLength(1, { message: 'nombre no puede estar vacio' })
  @MaxLength(100, { message: 'nombre no puede pasar de 100 caracteres' })
  @Matches(PATRON_NOMBRE, {
    message: 'nombre solo admite letras, numeros, punto, guion y guion bajo, sin espacios',
  })
  nombre!: string;

  @IsIn(TIPOS_EXCHANGE, { message: 'tipo debe ser direct, topic, fanout o headers' })
  tipo!: TipoExchange;

  @IsBoolean({ message: 'durable debe ser true o false' })
  durable: boolean = true;
}