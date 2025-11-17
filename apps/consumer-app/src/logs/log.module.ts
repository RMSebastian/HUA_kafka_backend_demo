import { Module } from '@nestjs/common';
import { CustomLoggerService } from './log.service';

@Module({
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
