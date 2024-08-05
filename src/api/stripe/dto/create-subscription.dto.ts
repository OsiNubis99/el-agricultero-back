import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Price } from 'src/database/schemas/price.schema';
import { Subscription } from 'src/database/schemas/subscription.schema';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'icon',
    example: 'https://example.com',
    required: true,
  })
  picture: Subscription['picture'];

  @IsNotEmpty()
  @ApiProperty({
    description: 'amount $',
    example: 10.0,
    required: true,
  })
  amount: Price['amount'];

  @IsNotEmpty()
  @ApiProperty({
    description: 'icon',
    example: '10.0 Credits',
    required: true,
  })
  name: Subscription['name'];

  @IsNotEmpty()
  @ApiProperty({
    description: 'icon',
    example: 'description',
    required: true,
  })
  description: Subscription['description'];
}
