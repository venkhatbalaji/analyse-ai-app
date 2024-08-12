import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { GEMINI_PRO_MODEL } from '../gemini/gemini.constants';
import { GenerativeModel } from '@google/generative-ai';
import { User, UserDocument } from '../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  MonthlyExpense,
  ExpenseInfo,
  MonthlyExpenseDocument,
} from 'src/schema/monthly-expense.schema';

@Controller()
export class KafkaController {
  constructor(
    @Inject(GEMINI_PRO_MODEL) private readonly proModel: GenerativeModel,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(MonthlyExpense.name)
    private readonly expenseModel: Model<MonthlyExpenseDocument>,
  ) {}

  @EventPattern('post-user-message')
  async handleMyTopic(@Payload() message) {
    try {
      const { messages, userId } = message;
      const analysisResults = await Promise.all(
        messages.map(async (text) => {
          const analysis = await this.analyzeMessage(text);
          return analysis;
        }),
      );
      await this.saveToMongoDB(
        userId,
        analysisResults.filter((i) => i !== null),
      );
    } catch (error) {
      console.error(error);
    }
  }
  // Function to analyze a single message using the GenerativeModel (Google Gemini AI)
  private async analyzeMessage(text: string): Promise<any> {
    const prompt = `Extract transaction details from the following message:\n"${text}" and return in the following format in json
      "amount": "00.00",
      "category": "Ex: RESTAURANT",
      "vendor": 'ex: ZOYA PALACE RESTAURANT',
      "location": 'ex: Abu Dhabi',
      "type": 'ex: Credit Card Purchase',`;
    const { totalTokens } = await this.proModel.countTokens(prompt);
    console.log(`Tokens: ${JSON.stringify(totalTokens)}`);
    const result = await this.proModel.generateContent(prompt);
    const response = await result.response.text();
    const details = this.extractDetails(response);
    return details;
  }

  // Example function to extract details from the AI response
  private extractDetails(responseText: string): any {
    try {
      const parsedResponse = JSON.parse(responseText);
      return {
        ...parsedResponse,
        date: new Date(),
      } as ExpenseInfo;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private async saveToMongoDB(userId: string, analysisResults: ExpenseInfo[]) {
    const user = await this.userModel.findOne({ userId: userId });
    if (!user) {
      await this.userModel.create({
        userId: userId,
      });
    }
    const promises = analysisResults.map(async (analysisResult) => {
      await this.expenseModel.create({
        transactions: analysisResult,
        month: this.getMonthYear(new Date()),
        userId: userId,
      });
    });
    await Promise.all(promises);
  }

  private getMonthYear(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month and pad with zero
    return `${year}-${month}`;
  }
}
