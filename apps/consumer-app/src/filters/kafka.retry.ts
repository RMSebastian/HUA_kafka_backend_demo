import { ClientKafka, KafkaContext } from '@nestjs/microservices';
import { commitOffset } from '../utils/kafka.commitOffset';

const emitEvent = (kafka: ClientKafka, topic: string, payload: any) => {
  return new Promise<void>((resolve, reject) => {
    kafka.emit(topic, payload).subscribe({
      next: () => resolve(),
      error: (err) => reject(err),
    });
  });
};

export const handleKafkaRetries = async (
  kafka: ClientKafka,
  context: KafkaContext,
  topic: string,
  errorMessage?: any,
) => {
  const headers = context.getMessage().headers || {};
  const retryCount = parseInt(headers['retryCount']?.toString() || '0', 10);

  const newHeaders = {
    timestamp: new Date().toISOString(),
    retryCount: Buffer.from((retryCount + 1).toString()),
  };

  const value = {
    ...(context.getArgByIndex(0).value || {}),
    error: {
      topic: topic,
      message: errorMessage,
      action:
        retryCount >= Number(process.env.MAX_RETRY)
          ? 'Max amount of attempts were made in this request'
          : `Retrying... Attempt Nº${retryCount + 1} for topic ${topic} due to: ${errorMessage}`,
    },
  };

  const payload = {
    headers: newHeaders,
    key: new Date().getTime().toString(),
    value,
  };

  try {
    const retryTopic =
      retryCount >= Number(process.env.MAX_RETRY)
        ? `${topic}_dlq`
        : `${topic}_retry`;

    await emitEvent(kafka, retryTopic, payload);
    await commitOffset(context);
  } catch (error) {
    throw error;
  }
};
