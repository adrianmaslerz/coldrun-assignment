import {
  IsString,
  IsNotEmpty,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TruckStatus } from '../../domain/enums/truck-status.enum';

export class CreateTruckDto {
  @ApiProperty({
    description: 'Unique alphanumeric code',
    example: 'TRUCK001',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'code must contain only alphanumeric characters',
  })
  code: string;

  @ApiProperty({ description: 'Truck name', example: 'Volvo FH16' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Initial status (defaults to Out Of Service)',
    enum: TruckStatus,
  })
  @IsEnum(TruckStatus)
  status: TruckStatus;

  @ApiPropertyOptional({ description: 'Optional description' })
  @IsOptional()
  @IsString()
  description?: string;
}
