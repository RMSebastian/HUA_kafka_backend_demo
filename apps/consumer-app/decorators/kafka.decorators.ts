import { SetMetadata } from '@nestjs/common';

export const KAFKA_TOPIC = 'KAFKA_TOPIC';
export const KAFKA_PAYLOAD_TYPE = 'KAFKA_PAYLOAD_TYPE';
export const KafkaTopic = <T = any>(topic: string, dto: new () => T) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    SetMetadata(KAFKA_TOPIC, topic)(target, key, descriptor);
    SetMetadata(KAFKA_PAYLOAD_TYPE, dto)(target, key, descriptor);
  };
};
