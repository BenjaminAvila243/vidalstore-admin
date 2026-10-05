import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard.js';
import { RolGuard } from '../auth/rol.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RabbitAdminService } from '../rabbit/rabbit-admin.service.js';
import { CrearColaDto } from './crear-cola.dto.js';

@Controller('v1/admin/colas')
@UseGuards(JwtGuard, RolGuard)
@Roles('administradores')
export class ColasController {
  constructor(private readonly rabbit: RabbitAdminService) {}

  @Get()
  listar() {
    return this.rabbit.listarColas();
  }

  @Post()
  crear(@Body() cuerpo: CrearColaDto) {
    return this.rabbit.crearCola(cuerpo);
  }

  @Delete(':nombre')
  @HttpCode(200)
  eliminar(@Param('nombre') nombre: string) {
    return this.rabbit.eliminarCola(nombre);
  }
}