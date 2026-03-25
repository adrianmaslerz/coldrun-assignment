import { IsEnum, IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TruckStatus } from '../../domain/enums/truck-status.enum';
import { TruckProps } from '../../domain/interfaces/truck-props.interface';

const SORTABLE_FIELDS: (keyof TruckProps)[] = [
  'code',
  'name',
  'status',
  'createdAt',
  'updatedAt',
];

export class QueryTrucksDto {
  @ApiPropertyOptional({ description: 'Filter by status', enum: TruckStatus })
  @IsOptional()
  @IsEnum(TruckStatus)
  status?: TruckStatus;

  @ApiPropertyOptional({ description: 'Filter by code (partial match)' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Filter by name (partial match)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: SORTABLE_FIELDS,
  })
  @IsOptional()
  @IsIn(SORTABLE_FIELDS)
  sortBy?: keyof TruckProps;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
