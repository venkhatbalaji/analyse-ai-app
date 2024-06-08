import { Controller, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class KafkaController {
  constructor() {}
  @EventPattern('my-topic')
  async handleMyTopic(@Payload() message) {
    console.log('Received message', message);
  }
}
