import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';

@Controller('/healthcheck')
export class HealthCheckController {
  constructor() {}
  @ApiTags('Health Check')
  @ApiOperation({ summary: 'Health Check' })
  @Get('')
  async healthcheck(@Res() res: ExpressResponse) {
    return res.status(HttpStatus.OK).json({ status: 'Healthy' });
  }
}
