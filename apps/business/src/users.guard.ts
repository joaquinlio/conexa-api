import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import configuration from 'config/configuration';
import { Request } from 'express';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Extract the token from the authorization header
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // Verify and decode the token using the JwtService
      const payload = await this.jwtService.verifyAsync(token, {
        secret: configuration.jwtsecret,
      });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
      request['token'] = token;
    } catch {
      // If the token verification fails, throw an UnauthorizedException
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Split the authorization header into type and token using destructuring
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
