import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { Partitioners } from 'kafkajs';
import { config } from 'dotenv';
config();

async function bootstrap() {
  console.log('process.env.KAFKA_SERVER', process.env.KAFKA_SERVER);
  const servers = process.env.KAFKA_SERVER.toString();
  const brokers = servers.includes(',') ? servers.split(',') : [servers];
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'ai-service',
          brokers: brokers,
        },
        producer: {
          createPartitioner: Partitioners.LegacyPartitioner,
        },
        consumer: {
          groupId: 'ai-consumer-group-id',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
