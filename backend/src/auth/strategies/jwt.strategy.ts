import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    
    // Ensure JWT_SECRET is always set
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required. Please set it in your .env file.');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    if (!payload.sub || !payload.email || !payload.type) {
      throw new UnauthorizedException('Invalid token payload');
    }
    
    return { id: payload.sub, email: payload.email, type: payload.type };
  }
}