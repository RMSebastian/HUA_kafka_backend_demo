import { ClientKafka, KafkaContext } from '@nestjs/microservices';
import { commitOffset } from '../utils/kafka.commitOffset';

export const handleKafkaRetries = async (
  kafka: ClientKafka,
  context: KafkaContext,
  topic: string,
  errorMessage?: any,
) => {
  const headers = context.getMessage().headers || {};
  const retryCount = parseInt(headers['retryCount']?.toString() || '0', 10);
  try {
    let actionMessage;
    if (retryCount >= Number(process.env.MAX_RETRY)) {
      actionMessage = 'Max amount of attempts were made in this request';
      await commitOffset(context);
      kafka.emit(`${topic}_dlq`, {
        headers: {
          timestamp: new Date().toISOString(),
          retryCount: Buffer.from((retryCount + 1).toString()),
        },
        key: new Date().getTime().toString(),
        value: {
          ...(context.getArgByIndex(0).value || {}),
          error: {
            action: actionMessage,
            message: errorMessage,
          },
        },
        partition: '0',
      });
    } else {
      actionMessage = `Retrying... Attempt Nº${retryCount + 1} for topic ${topic} due to: ${errorMessage}`;
      kafka.emit(`${topic}_retry`, {
        headers: {
          timestamp: new Date().toISOString(),
          retryCount: Buffer.from((retryCount + 1).toString()),
        },
        key: new Date().getTime().toString(),
        value: {
          ...(context.getArgByIndex(0).value || {}),
          error: {
            action: actionMessage,
            message: errorMessage,
          },
        },
        partition: '0',
      });
      await commitOffset(context);
    }
    throw new Error(`${errorMessage} ${actionMessage}`);
  } catch (error) {
    throw error;
  }
};
