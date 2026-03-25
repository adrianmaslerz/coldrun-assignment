import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrucksModule } from './trucks/trucks.module';

@Module({
  imports: [TrucksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
