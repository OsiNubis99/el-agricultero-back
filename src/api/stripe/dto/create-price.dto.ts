import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePriceDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'icon',
    required: true,
  })
  image: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'amount $',
    example: 10.0,
    required: true,
  })
  amount: number;

  recurring?: {
    interval: 'day' | 'month' | 'week' | 'year';
  };
}
