import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsumerAppService {
  getHello(): string {
    return 'Hello Consumer!';
  }
}
