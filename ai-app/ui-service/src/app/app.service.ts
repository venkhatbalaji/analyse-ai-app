import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';
import {
  createSuccessResponse,
  createFailureResponse,
  Response,
  ErrorResponse,
} from 'src/utils/response.utils';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('KAFKA-CLIENT')
    private readonly producerService: ClientKafka,
  ) {}

  async postMessages(): Promise<Response<object> | ErrorResponse<object>> {
    try {
      await this.producerService.emit(
        'post-user-message',
        JSON.stringify({
          email: 'test',
        }),
      );
      return createSuccessResponse({ test: true });
    } catch (error) {
      return createFailureResponse({ test: false });
    }
  }
}
