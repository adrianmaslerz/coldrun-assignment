import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { TrucksController } from './presentation/trucks.controller.js';

import { CreateTruckHandler } from './application/commands/create-truck.handler.js';
import { UpdateTruckHandler } from './application/commands/update-truck.handler.js';
import { DeleteTruckHandler } from './application/commands/delete-truck.handler.js';
import { GetTruckHandler } from './application/queries/get-truck.handler.js';
import { ListTrucksHandler } from './application/queries/list-trucks.handler.js';

import { TruckDomainService } from './domain/truck-domain.service.js';
import { TruckRepository } from './application/ports/truck.repository.js';
import { InMemoryTruckRepository } from './infrastructure/in-memory-truck.repository.js';

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
