import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ColasModule } from './colas/colas.module.js';
import { ExchangesModule } from './exchanges/exchanges.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ColasModule, ExchangesModule],
})
export class AppModule {}