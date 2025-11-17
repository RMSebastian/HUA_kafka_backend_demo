const { Kafka, logLevel } = require('kafkajs')

async function run() {
  const kafka = new Kafka({
    clientId: 'test',
    brokers: ['bootstrapqa.hospitalaustral.edu.ar:9094'],
    ssl: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
      maxVersion: 'TLSv1.2',
      servername: 'bootstrapqa.hospitalaustral.edu.ar',
    },
    sasl: {
      mechanism: 'scram-sha-512',
      username: 'my-user',
      password: 'nNlFDpi1SimPFd3uICe9VdezqZR6cGPW',
    },
    logLevel: logLevel.DEBUG
  })

  const consumer = kafka.consumer({ groupId: 'test-group' })
  await consumer.connect()
}

run().catch(console.error)
