import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, DocumentsModule, UserModule]
})
export class ApiModule { }
