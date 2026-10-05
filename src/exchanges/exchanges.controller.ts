import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard.js';
import { RolGuard } from '../auth/rol.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RabbitAdminService } from '../rabbit/rabbit-admin.service.js';
import { CrearExchangeDto } from './crear-exchange.dto.js';

@Controller('v1/admin/exchanges')
@UseGuards(JwtGuard, RolGuard)
@Roles('administradores')
export class ExchangesController {
  constructor(private readonly rabbit: RabbitAdminService) {}

  @Get()
  listar() {
    return this.rabbit.listarExchanges();
  }

  @Post()
  crear(@Body() cuerpo: CrearExchangeDto) {
    return this.rabbit.crearExchange(cuerpo);
  }

  @Delete(':nombre')
  @HttpCode(200)
  eliminar(@Param('nombre') nombre: string) {
    return this.rabbit.eliminarExchange(nombre);
  }
}