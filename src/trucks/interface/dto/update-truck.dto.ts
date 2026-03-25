import {
  IsString,
  IsNotEmpty,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TruckStatus } from '../../domain/enums/truck-status.enum';

export class UpdateTruckDto {
  @ApiPropertyOptional({
    description: 'Unique alphanumeric code',
    example: 'TRUCK002',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'code must contain only alphanumeric characters',
  })
  code?: string;

  @ApiPropertyOptional({ description: 'Truck name', example: 'Scania R500' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ description: 'Truck status', enum: TruckStatus })
  @IsOptional()
  @IsEnum(TruckStatus)
  status?: TruckStatus;

  @ApiPropertyOptional({ description: 'Optional description' })
  @IsOptional()
  @IsString()
  description?: string;
}
