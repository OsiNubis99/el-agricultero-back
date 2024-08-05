import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ModifyPlansDto {
  @IsNotEmpty()
  @ApiProperty()
  planId: string;
}
