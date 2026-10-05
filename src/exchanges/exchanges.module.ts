import { Module } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard.js';
import { RolGuard } from '../auth/rol.guard.js';
import { RabbitModule } from '../rabbit/rabbit.module.js';
import { ExchangesController } from './exchanges.controller.js';

@Module({
  imports: [RabbitModule],
  controllers: [ExchangesController],
  providers: [JwtGuard, RolGuard],
})
export class ExchangesModule {}