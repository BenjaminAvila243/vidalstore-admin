import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify } from 'jose';

export type Usuario = { sub: string; grupos: string[] };

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly issuer: string;
  private readonly clientId: string;
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(config: ConfigService) {
    this.issuer = config.getOrThrow<string>('COGNITO_ISSUER');
    this.clientId = config.getOrThrow<string>('COGNITO_CLIENT_ID');
    this.jwks = createRemoteJWKSet(new URL(`${this.issuer}/.well-known/jwks.json`));
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<{ headers: Record<string, string>; usuario?: Usuario }>();
    const cabecera = req.headers.authorization;

    if (!cabecera?.startsWith('Bearer ')) {
      throw new UnauthorizedException('sin token');
    }

    let payload;
    try {
      ({ payload } = await jwtVerify(cabecera.slice(7), this.jwks, { issuer: this.issuer }));
    } catch (e) {
      throw new UnauthorizedException((e as Error).message);
    }

    if (payload.token_use !== 'access') {
      throw new UnauthorizedException('no es un access token');
    }
    if (payload.client_id !== this.clientId) {
      throw new UnauthorizedException('app client desconocido');
    }

    req.usuario = {
      sub: payload.sub as string,
      grupos: (payload['cognito:groups'] as string[]) ?? [],
    };
    return true;
  }
}