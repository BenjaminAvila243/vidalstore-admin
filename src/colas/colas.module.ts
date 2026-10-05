import { Module } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard.js';
import { RolGuard } from '../auth/rol.guard.js';
import { RabbitModule } from '../rabbit/rabbit.module.js';
import { ColasController } from './colas.controller.js';

@Module({
  imports: [RabbitModule],
  controllers: [ColasController],
  providers: [JwtGuard, RolGuard],
})
export class ColasModule {}