import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CreateTruckHandler } from './application/commands/create-truck.handler';
import { UpdateTruckHandler } from './application/commands/update-truck.handler';
import { DeleteTruckHandler } from './application/commands/delete-truck.handler';
import { GetTruckHandler } from './application/queries/get-truck.handler';
import { ListTrucksHandler } from './application/queries/list-trucks.handler';
import { InMemoryTruckRepository } from './infrastructure/in-memory-truck.repository';
import { TrucksController } from './interface/trucks.controller';
import { TruckDomainService } from './domain/services/truck-domain.service';
import { TruckRepository } from './domain/repositories/truck.repository';

const CommandHandlers = [
  CreateTruckHandler,
  UpdateTruckHandler,
  DeleteTruckHandler,
];

const QueryHandlers = [GetTruckHandler, ListTrucksHandler];

@Module({
  imports: [CqrsModule],
  controllers: [TrucksController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    TruckDomainService,
    {
      provide: TruckRepository,
      useClass: InMemoryTruckRepository,
    },
  ],
})
export class TrucksModule {}
