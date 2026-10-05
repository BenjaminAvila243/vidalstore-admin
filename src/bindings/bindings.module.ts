import { Module } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard.js';
import { RolGuard } from '../auth/rol.guard.js';
import { RabbitModule } from '../rabbit/rabbit.module.js';
import { BindingsController } from './bindings.controller.js';

@Module({
  imports: [RabbitModule],
  controllers: [BindingsController],
  providers: [JwtGuard, RolGuard],
})
export class BindingsModule {}