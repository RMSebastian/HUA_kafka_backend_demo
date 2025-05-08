import { Controller, Get } from '@nestjs/common';
import { ConsumerAppService } from './consumer-app.service';

@Controller()
export class ConsumerAppController {
  constructor(private readonly consumerAppService: ConsumerAppService) {}

  @Get()
  getHello(): string {
    return this.consumerAppService.getHello();
  }
}
