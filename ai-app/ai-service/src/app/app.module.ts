import { Module } from '@nestjs/common';
import { KafkaController } from '../kakfa/kafka.controller';
import { ConfigModule } from '../config/config.module';
import {
  GeminiProModelProvider,
  GeminiProVisionModelProvider,
} from '../gemini/gemini.providers';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schema/user.schema';
import {
  MonthlyExpense,
  MonthlyExpenseSchema,
} from '../schema/monthly-expense.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRoot('mongodb://localhost/ai-app'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MonthlyExpense.name, schema: MonthlyExpenseSchema },
    ]),
  ],
  providers: [GeminiProModelProvider, GeminiProVisionModelProvider],
  controllers: [KafkaController],
})
export class AppModule {}
