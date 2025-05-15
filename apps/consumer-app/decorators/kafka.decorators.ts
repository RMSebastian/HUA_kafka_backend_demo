import newrelic from 'newrelic';
import { KafkaContext } from '@nestjs/microservices';

export function KafkaTransaction(topicName?: string): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const kafkaContext: KafkaContext | undefined = args.find(
        (arg) => arg && typeof arg.getTopic === 'function',
      );

      const topic = topicName || kafkaContext?.getTopic?.() || 'unknown-topic';
      const partition = kafkaContext?.getPartition?.();
      const offset = kafkaContext?.getMessage()?.offset;
      const key = kafkaContext?.getMessage()?.key?.toString();

      return newrelic.startBackgroundTransaction(`Kafka/${topic}`, async () => {
        const tx = newrelic.getTransaction();

        try {
          newrelic.addCustomAttributes({
            topic,
            partition,
            offset,
            key,
          });

          const result = await original.apply(this, args);
          tx.end();
          return result;
        } catch (err) {
          newrelic.noticeError(err);
          tx.end();
          throw err;
        }
      });
    };
  };
}
