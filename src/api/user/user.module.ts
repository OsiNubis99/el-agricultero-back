import { Module } from '@nestjs/common';

import { CommonModule } from 'src/common/common.module';
import { AuthModule } from '../auth/auth.module';
import { RegisterService } from './service/register.service';
import { UpdateService } from './service/update.service';
import { UserController } from './user.controller';

@Module({
  imports: [AuthModule, CommonModule],
  controllers: [UserController],
  providers: [RegisterService, UpdateService],
})
export class UserModule {}
