import { Module } from '@nestjs/common';
import { KafkaController } from '../kakfa/kafka.controller';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [],
  controllers: [KafkaController],
})
export class AppModule {}
