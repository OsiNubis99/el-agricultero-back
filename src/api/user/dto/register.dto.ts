import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { EmailDto } from 'src/api/auth/dto/email.dto';
import { User } from 'src/database/schemas/user.schema';

export class RegisterDto extends EmailDto {
  @IsNotEmpty()
  @ApiProperty()
  name: User['name'];

  @IsNotEmpty()
  @ApiProperty({ example: 'claveSuperSegura123#' })
  password: User['password'];

  @IsNotEmpty()
  @ApiProperty({ example: 'claveSuperSegura123#' })
  confirmPassword: User['password'];

  @IsOptional()
  type: User['type'];
}
