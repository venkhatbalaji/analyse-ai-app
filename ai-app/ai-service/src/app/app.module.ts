import { Module } from '@nestjs/common';
import { KafkaController } from '../kakfa/kafka.controller';
import { ConfigModule } from '../config/config.module';
import { GeminiProModelProvider, GeminiProVisionModelProvider } from '../gemini/gemini.providers';
import { FirebaseProvider } from '../firebase/firebase.provider';

@Module({
  imports: [ConfigModule],
  providers: [GeminiProModelProvider, GeminiProVisionModelProvider, FirebaseProvider],
  controllers: [KafkaController],
})
export class AppModule {}
