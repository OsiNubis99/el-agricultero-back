import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStripePriceDto {
  @IsOptional()
  @ApiProperty({
    name: 'image',
    type: String,
    description: 'icon',
    required: true,
  })
  image: string;

  @IsNotEmpty()
  @ApiProperty({
    name: 'amount',
    type: Number,
    description: 'amount $',
    example: 10.0,
    required: true,
  })
  amount: number;
}
