import amqplib from 'amqplib';

const [exchange, routingKey, texto = 'mensaje de prueba'] = process.argv.slice(2);
if (!exchange || !routingKey) {
  console.error('Uso: node scripts/publicar-prueba.mjs <exchange> <routingKey> [texto]');
  process.exit(1);
}

const url = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';
const conexion = await amqplib.connect(url);
const canal = await conexion.createConfirmChannel();

canal.publish(exchange, routingKey, Buffer.from(JSON.stringify({ texto })), {
  persistent: true,
  contentType: 'application/json',
}, async (error) => {
  if (error) {
    console.error('El broker no confirmo el mensaje:', error.message);
    process.exitCode = 1;
  } else {
    console.log(`Mensaje publicado en ${exchange} con la routing key ${routingKey}`);
  }
  await canal.close();
  await conexion.close();
});