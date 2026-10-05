import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard.js';
import { RolGuard } from '../auth/rol.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('v1/admin/colas')
@UseGuards(JwtGuard, RolGuard)
@Roles('administradores')
export class ColasController {
  @Get()
  listar() {
    return { mensaje: 'autenticado como administrador' };
  }
}