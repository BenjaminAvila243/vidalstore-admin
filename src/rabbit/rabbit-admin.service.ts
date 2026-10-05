import {
  BadGatewayException, ConflictException, Injectable, NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type ColaResumen = {
  nombre: string;
  mensajes: number;
  consumidores: number;
  durable: boolean;
  tipo: string;
};

export type NuevaCola = {
  nombre: string;
  durable: boolean;
  tipo?: 'classic' | 'quorum';
  deadLetterExchange?: string;
  maxLength?: number;
};

type ColaApi = {
  name: string;
  messages?: number;
  consumers?: number;
  durable: boolean;
  type: string;
};

@Injectable()
export class RabbitAdminService {
  private readonly base: string;
  private readonly autorizacion: string;
  private readonly vhost = encodeURIComponent('/');

  constructor(config: ConfigService) {
    this.base = config.getOrThrow<string>('RABBITMQ_API_URL');
    const usuario = config.getOrThrow<string>('RABBITMQ_USER');
    const clave = config.getOrThrow<string>('RABBITMQ_PASSWORD');
    this.autorizacion = `Basic ${Buffer.from(`${usuario}:${clave}`).toString('base64')}`;
  }

  async listarColas(): Promise<ColaResumen[]> {
    const colas = (await this.llamar('GET', '/queues')) as ColaApi[];
    return colas.map((c) => ({
      nombre: c.name,
      mensajes: c.messages ?? 0,
      consumidores: c.consumers ?? 0,
      durable: c.durable,
      tipo: c.type,
    }));
  }

  async crearCola(cola: NuevaCola): Promise<{ creada: string }> {
    const existentes = await this.listarColas();
    if (existentes.some((c) => c.nombre === cola.nombre)) {
      throw new ConflictException(`la cola ${cola.nombre} ya existe`);
    }

    const argumentos: Record<string, unknown> = {};
    if (cola.tipo) argumentos['x-queue-type'] = cola.tipo;
    if (cola.deadLetterExchange) argumentos['x-dead-letter-exchange'] = cola.deadLetterExchange;
    if (cola.maxLength !== undefined) argumentos['x-max-length'] = cola.maxLength;

    await this.llamar('PUT', `/queues/${this.vhost}/${encodeURIComponent(cola.nombre)}`, {
      durable: cola.durable,
      auto_delete: false,
      arguments: argumentos,
    });
    return { creada: cola.nombre };
  }

  async eliminarCola(nombre: string): Promise<{ eliminada: string }> {
    await this.llamar('DELETE', `/queues/${this.vhost}/${encodeURIComponent(nombre)}`);
    return { eliminada: nombre };
  }

  private async llamar(metodo: string, ruta: string, cuerpo?: unknown): Promise<unknown> {
    let respuesta: Response;
    try {
      respuesta = await fetch(`${this.base}${ruta}`, {
        method: metodo,
        headers: { authorization: this.autorizacion, 'content-type': 'application/json' },
        body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
      });
    } catch {
      throw new ServiceUnavailableException('el broker no responde');
    }

    if (respuesta.status === 404) throw new NotFoundException('el recurso no existe en el broker');
    if (respuesta.status === 409) throw new ConflictException('el recurso ya existe o esta en uso');
    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      throw new BadGatewayException(`el broker rechazo la operacion: ${detalle}`);
    }
    const texto = await respuesta.text();
    return texto ? JSON.parse(texto) : null;
  }
}