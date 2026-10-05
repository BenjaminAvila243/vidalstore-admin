import { Module } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard.js';
import { RolGuard } from '../auth/rol.guard.js';
import { ColasController } from './colas.controller.js';

@Module({
  controllers: [ColasController],
  providers: [JwtGuard, RolGuard],
})
export class ColasModule {}