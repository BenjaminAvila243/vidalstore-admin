import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from './roles.decorator.js';
import type { Usuario } from './jwt.guard.js';

@Injectable()
export class RolGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requeridos = this.reflector.getAllAndOverride<string[]>(ROLES, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!requeridos || requeridos.length === 0) return true;

    const req = ctx.switchToHttp().getRequest<{ usuario: Usuario }>();
    if (!requeridos.some((g) => req.usuario.grupos.includes(g))) {
      throw new ForbiddenException(`requiere uno de estos grupos: ${requeridos.join(', ')}`);
    }
    return true;
  }
}