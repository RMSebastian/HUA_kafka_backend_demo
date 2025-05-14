import { Injectable, ConsoleLogger } from '@nestjs/common';
import { LoggingSenderService } from '../utils/sendlogs';

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  private readonly sender: LoggingSenderService;

  constructor(context: string) {
    super(context);
    this.sender = new LoggingSenderService();
  }

  log(message: any, context?: string) {
    console.log('message:', message);
    super.log(message, context);
    this.sender.sendLog({
      level: 'Information',
      message: message as string,
      serviceVersion: '1.0',
      environment: 'Development',
      host: 'localhost.com',
      application: 'POC',
      timestamp: new Date().toISOString(),
    });
  }

  fatal(message: any, trace?: string, context?: string) {
    super.fatal?.(message, trace, context); // Optional chaining in case parent doesn't have fatal
    this.sender.sendLog({
      level: 'Critical',
      message: message as string,
      serviceVersion: '1.0',
      environment: 'Development',
      host: 'localhost.com',
      application: 'POC',
      timestamp: new Date().toISOString(),
    });
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context);
    this.sender.sendLog({
      level: 'Error',
      message: message as string,
      serviceVersion: '1.0',
      environment: 'Development',
      host: 'localhost.com',
      application: 'POC',
      timestamp: new Date().toISOString(),
    });
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    this.sender.sendLog({
      level: 'Warning',
      message: message as string,
      serviceVersion: '1.0',
      environment: 'Development',
      host: 'localhost.com',
      application: 'POC',
      timestamp: new Date().toISOString(),
    });
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
    this.sender.sendLog({
      level: 'Debug',
      message: message as string,
      serviceVersion: '1.0',
      environment: 'Development',
      host: 'localhost.com',
      application: 'POC',
      timestamp: new Date().toISOString(),
    });
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
    this.sender.sendLog({
      level: 'Trace',
      message: message as string,
      serviceVersion: '1.0',
      environment: 'Development',
      host: 'localhost.com',
      application: 'POC',
      timestamp: new Date().toISOString(),
    });
  }
}
