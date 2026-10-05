import { randomUUID } from 'node:crypto';
import amqplib from 'amqplib';

const EXCHANGE = 'vidalstore.eventos';
const ROUTING_KEY = 'compra.realizada';

const variantes = {
  'no-json': {
    cuerpo: Buffer.from('esto no es un json {{{'),
    descripcion: 'texto que no es JSON',
  },
  'sin-campo': {
    cuerpo: Buffer.from(
      JSON.stringify({ licenciaId: randomUUID(), juegoId: 1, adquiridaEn: new Date().toISOString() }),
    ),
    descripcion: 'compra.realizada sin usuarioSub',
  },
};

const variante = process.argv[2];
if (!variante || !(variante in variantes)) {
  console.error('Uso: node scripts/publicar-envenenado.mjs <no-json | sin-campo>');
  process.exit(1);
}

const url = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';
const conexion = await amqplib.connect(url);
const canal = await conexion.createConfirmChannel();
const { cuerpo, descripcion } = variantes[variante];
const eventoId = randomUUID();

canal.publish(
  EXCHANGE,
  ROUTING_KEY,
  cuerpo,
  {
    persistent: true,
    contentType: 'application/json',
    headers: { 'x-evento-id': eventoId, 'x-emitido-en': new Date().toISOString() },
  },
  async (error) => {
    if (error) {
      console.error('El broker no confirmo el mensaje:', error.message);
      process.exitCode = 1;
    } else {
      console.log(`Mensaje envenenado publicado (${descripcion}), evento ${eventoId}`);
    }
    await canal.close();
    await conexion.close();
  },
);