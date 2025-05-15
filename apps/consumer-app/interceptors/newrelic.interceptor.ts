import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as newrelic from 'newrelic';

@Injectable()
export class NewrelicInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Verificar si es un contexto de Kafka
    const isKafkaContext =
      context.getType() === 'rpc' && context.getArgByIndex(0)?.topic;

    if (isKafkaContext) {
      return this.handleKafkaContext(context, next);
    }

    // Mantener el comportamiento original para HTTP
    return this.handleHttpContext(context, next);
  }

  private handleKafkaContext(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const kafkaContext = context.switchToRpc().getContext();
    const topic = kafkaContext.getTopic();
    const transactionName = `Kafka/${topic}`;

    return newrelic.startBackgroundTransaction(transactionName, () => {
      const transaction = newrelic.getTransaction();

      return next.handle().pipe(
        tap(() => {
          transaction.end();
        }),
        // Manejar errores para que no rompan el transaction tracking
        tap({
          error: (err) => {
            newrelic.noticeError(err);
            transaction.end();
          },
        }),
      );
    });
  }

  private handleHttpContext(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return newrelic.startWebTransaction(context.getHandler().name, () => {
      const transaction = newrelic.getTransaction();

      return next.handle().pipe(
        tap(() => {
          transaction.end();
        }),
        tap({
          error: (err) => {
            newrelic.noticeError(err);
            transaction.end();
          },
        }),
      );
    });
  }
}
