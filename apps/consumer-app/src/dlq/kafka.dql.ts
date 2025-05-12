import { ClientKafka, KafkaContext } from '@nestjs/microservices';

export const handleKafkaError = (
  kafka: ClientKafka,
  context: KafkaContext,
  data: { topic: string; message: string },
) => {
  const headers = {
    transactionId: new Date().getTime().toString(),
    timestamp: new Date().toISOString(),
    retryCount: '2',
  };
  kafka.emit(`${data.topic}_dlq`, {
    value: {
      topic: data.topic,
      message: data.message,
    },
    headers: headers,
    key: context.getArgByIndex(0).timestamp,
    partition: '0',
  });
};
