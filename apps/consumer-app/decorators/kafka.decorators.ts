import { SetMetadata } from '@nestjs/common';

export const KAFKA_TOPIC = 'KAFKA_TOPIC';
export const KAFKA_PAYLOAD_TYPE = 'KAFKA_PAYLOAD_TYPE';
export const KafkaTopic = <T = any>(
  topic: string | string[],
  dto: new () => T | undefined = undefined,
) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Array.isArray(topic)
      ? topic.forEach((t) =>
          SetMetadata(KAFKA_TOPIC, t)(target, key, descriptor),
        )
      : SetMetadata(KAFKA_TOPIC, topic)(target, key, descriptor);
    SetMetadata(KAFKA_PAYLOAD_TYPE, dto)(target, key, descriptor);
  };
};
