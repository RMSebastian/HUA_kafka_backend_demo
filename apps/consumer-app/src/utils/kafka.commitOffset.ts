import { KafkaContext } from '@nestjs/microservices/ctx-host';

export const commitOffset = async (context: KafkaContext) => {
  try {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    const consumer = context.getConsumer();

    const nextOffset = (BigInt(offset) + 1n).toString();

    await consumer.commitOffsets([{ topic, partition, offset: nextOffset }]);
  } catch (error) {
    console.error('Error commitOffset: ', error);
  }
};
