import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ColasModule } from './colas/colas.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ColasModule],
})
export class AppModule {}