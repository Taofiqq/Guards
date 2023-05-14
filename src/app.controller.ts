import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';

@Controller()
// uncomment below line of code for controller-scoped binding
// @UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  // uncomment below line of code for method-scoped binding
  // @UseGuards(AuthGuard)
  test(): string {
    return 'This is a Test Route';
  }
}
