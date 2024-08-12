import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('AI Service')
@Controller('api/v1/ai')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 401, description: '' })
  @Post('messages')
  async postMessages(@Body() body: object, @Res() res: ExpressResponse) {
    const response = await this.appService.postMessages();
    return res
      .status(
        response.success === false ? HttpStatus.BAD_REQUEST : HttpStatus.OK,
      )
      .json({ ...response });
  }
}
