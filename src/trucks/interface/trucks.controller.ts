import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { QueryTrucksDto } from './dto/query-trucks.dto';
import { CreateTruckCommand } from '../application/commands/create-truck.command';
import { UpdateTruckCommand } from '../application/commands/update-truck.command';
import { DeleteTruckCommand } from '../application/commands/delete-truck.command';
import { GetTruckQuery } from '../application/queries/get-truck.query';
import { ListTrucksQuery } from '../application/queries/list-trucks.query';
import { TruckProps } from '../domain/interfaces/truck-props.interface';

@ApiTags('Trucks')
@Controller('trucks')
export class TrucksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new truck' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Truck created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Duplicate truck code',
  })
  async create(@Body() dto: CreateTruckDto): Promise<TruckProps> {
    return this.commandBus.execute(
      new CreateTruckCommand(dto.code, dto.name, dto.status, dto.description),
    );
  }

  @Get()
  @ApiOperation({ summary: 'List trucks with optional filtering and sorting' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of trucks' })
  async findAll(@Query() query: QueryTrucksDto): Promise<TruckProps[]> {
    return this.queryBus.execute(
      new ListTrucksQuery(
        query.status,
        query.code,
        query.name,
        query.sortBy,
        query.order,
      ),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a truck by ID' })
  @ApiParam({ name: 'id', description: 'Truck UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Truck found' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Truck not found',
  })
  async findOne(@Param('id') id: string): Promise<TruckProps> {
    return this.queryBus.execute(new GetTruckQuery(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update truck fields (including status)' })
  @ApiParam({ name: 'id', description: 'Truck UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Truck updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Truck not found',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid status transition',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Duplicate truck code',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTruckDto,
  ): Promise<TruckProps> {
    return this.commandBus.execute(
      new UpdateTruckCommand(
        id,
        dto.code,
        dto.name,
        dto.status,
        dto.description,
      ),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a truck' })
  @ApiParam({ name: 'id', description: 'Truck UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Truck deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Truck not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteTruckCommand(id));
  }
}
