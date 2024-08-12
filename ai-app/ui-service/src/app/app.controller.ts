import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateMessageDto } from '../validator/message.validator';
import {
  MonthlyExpense,
  MonthlyExpenseDocument,
} from '../schema/monthly-expense.schema';

@ApiTags('UI Service')
@Controller('api/v1/ai')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 401, description: '' })
  @Post('messages')
  async postMessages(
    @Body() body: CreateMessageDto,
    @Res() res: ExpressResponse,
  ) {
    const response = await this.appService.postMessages(body);
    return res
      .status(
        response.success === false
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.CREATED,
      )
      .json({ ...response });
  }

  @Get(':userId')
  async getAllExpenses(
    @Param('userId') userId: string,
  ): Promise<MonthlyExpense[]> {
    return this.appService.getAllExpenses(userId);
  }
}
