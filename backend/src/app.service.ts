import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hostname } from 'os';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  getInfo() {
    return {
      hostname: hostname(),
      version: this.config.get<string>('APP_VERSION', 'dev'),
      environment: this.config.get<string>('NODE_ENV', 'development'),
    };
  }
}
