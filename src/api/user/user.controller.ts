import { Body, Controller, Patch, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/common/decorators/auth-request';
import { UserDocument } from 'src/database/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { UpdateDto } from './dto/update.dto';
import { RegisterService } from './service/register.service';
import { UpdateService } from './service/update.service';
import { BasicRequest } from 'src/common/decorators/basic-request';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly updateService: UpdateService,
  ) {}

  @Post()
  @BasicRequest({
    description: 'Register new user',
    response: 'Confirmation message',
  })
  register(@Body() body: RegisterDto) {
    return this.registerService.execute(body);
  }

  @Patch()
  @AuthRequest({
    description: "Update user's data",
    response: 'New user data',
  })
  update(@Request() { user }: { user: UserDocument }, @Body() body: UpdateDto) {
    return this.updateService.execute({ user, ...body });
  }
}
