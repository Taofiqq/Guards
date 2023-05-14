import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { BusinessGuard } from './guards/business.guard';
import { AuthMetaData } from './auth.metada.decorator';

@Controller()
@UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  test(): string {
    return 'This is a Test Route';
  }
  @Get('public')
  @AuthMetaData('SkipAuthorizationCheck')
  getPublic(): string {
    return 'public';
  }
}
