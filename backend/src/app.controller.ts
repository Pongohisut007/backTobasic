import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Use for livenessProbe / readinessProbe
  @Get('health')
  health() {
    return { status: 'ok' };
  }

  // Shows which pod answered + env values (try ConfigMap / Secret here)
  @Get('info')
  info() {
    return this.appService.getInfo();
  }

  @Get('todos')
  getTodos() {
    return this.appService.getTodos();
  }

  @Post('todos')
  addTodo(@Body('title') title: string) {
    return this.appService.addTodo(title);
  }
}
