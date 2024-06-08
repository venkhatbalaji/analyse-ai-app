import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { HealthCheckController } from '../healthcheck/healthcheck.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA-CLIENT',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'ui-service-id',
              brokers:
                configService.get('KAFKA_SERVER').split(',').length === 0
                  ? [configService.get('KAFKA_SERVER').split(',')]
                  : configService.get('KAFKA_SERVER').split(','),
            },
            producer: {
              createPartitioner: Partitioners.LegacyPartitioner,
            },
            producerOnlyMode: true,
            consumer: {
              groupId: 'ai-analyser-group',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ConfigModule,
  ],
  providers: [AppService],
  controllers: [AppController, HealthCheckController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
