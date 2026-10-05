import { Body, Controller, Delete, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard.js';
import { RolGuard } from '../auth/rol.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RabbitAdminService } from '../rabbit/rabbit-admin.service.js';
import { BindingDto } from './binding.dto.js';

@Controller('v1/admin/bindings')
@UseGuards(JwtGuard, RolGuard)
@Roles('administradores')
export class BindingsController {
  constructor(private readonly rabbit: RabbitAdminService) {}

  @Post()
  crear(@Body() cuerpo: BindingDto) {
    return this.rabbit.crearBinding(cuerpo);
  }

  @Delete()
  @HttpCode(200)
  eliminar(@Body() cuerpo: BindingDto) {
    return this.rabbit.eliminarBinding(cuerpo);
  }
}