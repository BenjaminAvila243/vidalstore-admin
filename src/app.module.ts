import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BindingsModule } from './bindings/bindings.module.js';
import { ColasModule } from './colas/colas.module.js';
import { ExchangesModule } from './exchanges/exchanges.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ColasModule, ExchangesModule, BindingsModule],
})
export class AppModule {}