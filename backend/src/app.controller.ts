import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Shows which pod answered the request
  @Get('info')
  getInfo() {
    return this.appService.getInfo();
  }
}
