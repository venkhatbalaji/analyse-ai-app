import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import {
  createSuccessResponse,
  Response,
  ErrorResponse,
} from 'src/utils/response.utils';
import { CreateMessageDto } from '../validator/message.validator';
import { User, UserDocument } from '../schema/user.schema';
import { Model } from 'mongoose';
import {
  MonthlyExpense,
  MonthlyExpenseDocument,
} from '../schema/monthly-expense.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('KAFKA-CLIENT')
    private readonly producerService: ClientKafka,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(MonthlyExpense.name)
    private readonly expenseModel: Model<MonthlyExpenseDocument>,
  ) {}

  async postMessages(
    message: CreateMessageDto,
  ): Promise<Response<object> | ErrorResponse<object>> {
    try {
      await this.producerService.emit(
        'post-user-message',
        JSON.stringify(message),
      );
      return createSuccessResponse({ message: 'processing' });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to post messages',
        error.message,
      );
    }
  }

  async getAllExpenses(userId: string): Promise<MonthlyExpense[]> {
    return this.expenseModel.find({ userId }).exec();
  }
}
