import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/common/decorators/auth-request';
import { BasicRequest } from 'src/common/decorators/basic-request';
import { UserD } from 'src/common/decorators/user.decorator';
import { Either } from 'src/common/generics/either';
import { UserDocument } from 'src/database/schemas/user.schema';
import { AuthService } from './auth.service';
import { EmailDto } from './dto/email.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('profile')
  @AuthRequest({
    description: 'Validate bearer token',
    response: 'User document',
  })
  getProfile(@UserD() user: UserDocument) {
    return Either.makeRight(user);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @BasicRequest({
    description: 'Validate email and password',
    response: 'Bearer access_token',
  })
  @ApiBody({ type: LoginDto })
  async login(@UserD() user: UserDocument) {
    return this.authService.login(user);
  }

  @Post('send-email-validation')
  @BasicRequest({
    description: 'Send EmailValidation email if user exist',
    response: 'OK',
  })
  async emailValidation(@Body() data: EmailDto) {
    return this.authService.emailValidation(data.email);
  }

  @Post('validate-email/:code')
  @BasicRequest({
    description: 'Send EmailValidation email if user exist',
    response: 'OK',
  })
  async validateEmailCode(@Param('code') code: string, @Body() data: EmailDto) {
    return this.authService.validateEmailCode(data.email, code);
  }

  @Post('forgotten-password')
  @BasicRequest({
    description: 'Send forgottenPassword email if user exist',
    response: 'OK',
  })
  async forgottenPassword(@Body() data: EmailDto) {
    return this.authService.forgottenPassword(data.email);
  }
}
