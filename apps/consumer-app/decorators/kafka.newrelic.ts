import newrelic from 'newrelic';

export function KafkaTransaction(topicName: string): MethodDecorator {
  return function (target, propertyKey, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return newrelic.startBackgroundTransaction(`Kafka/${topicName}`, () => {
        const tx = newrelic.getTransaction();

        try {
          const result = originalMethod.apply(this, args);
          if (result instanceof Promise) {
            return result
              .then((res) => {
                tx.end();
                return res;
              })
              .catch((err) => {
                newrelic.noticeError(err);
                tx.end();
                throw err;
              });
          } else {
            tx.end();
            return result;
          }
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
