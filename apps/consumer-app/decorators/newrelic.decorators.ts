import { EachMessagePayload } from '@nestjs/microservices/external/kafka.interface';
import newrelic from '../wrapper/newrelic.wrapper';
import { json } from 'stream/consumers';

export function NewRelicTransaction<T = any>() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (payload: T, ctx: EachMessagePayload) {
      const topic = ctx?.topic ?? 'unknown-topic';
      const partition = ctx?.partition;
      const offset = ctx?.message?.offset;
      const key = ctx?.message?.key?.toString();

      return newrelic.startBackgroundTransaction(`Kafka/${topic}`, async () => {
        const tx = newrelic.getTransaction();

        try {
          newrelic.addCustomAttributes({
            topic,
            partition,
            offset,
            key,
          });

          const result = await originalMethod.apply(this, [payload, ctx]);
          tx.end();
          return result;
        } catch (err) {
          newrelic.noticeError(err);
          tx.end();
          throw err;
        }
      });
    };

    return descriptor;
  };
}
