import { Module } from '@nestjs/common';
import { RabbitAdminService } from './rabbit-admin.service.js';

@Module({
  providers: [RabbitAdminService],
  exports: [RabbitAdminService],
})
export class RabbitModule {}