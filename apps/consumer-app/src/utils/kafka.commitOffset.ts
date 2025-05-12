import { KafkaContext } from '@nestjs/microservices/ctx-host';

export const commitOffset = async (context: KafkaContext) => {
  try {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();
    await consumer.commitOffsets([{ topic, partition, offset }]);
  } catch (error) {
    console.error('Error commitOffset: ', error);
  }
};
