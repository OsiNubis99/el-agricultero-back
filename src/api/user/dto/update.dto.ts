import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/database/schemas/user.schema';

export class UpdateDto {
  @ApiProperty()
  name?: User['name'];

  @ApiProperty()
  password?: User['password'];

  @ApiProperty()
  confirmPassword?: User['password'];
}
