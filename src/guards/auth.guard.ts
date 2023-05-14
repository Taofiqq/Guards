import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers;
    const authMetaData = this.reflector.getAllAndOverride<string[]>(
      'authorized',
      [context.getHandler(), context.getClass()],
    );

    if (authMetaData?.includes('SkipAuthorizationCheck')) {
      return true;
    }
    if (apiKey && apiKey.api_key === 'MY_API_KEY') {
      return true;
    }
    return false;
  }
}
