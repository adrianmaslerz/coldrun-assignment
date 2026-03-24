import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TrucksModule } from './trucks/trucks.module.js';

@Module({
  imports: [TrucksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
