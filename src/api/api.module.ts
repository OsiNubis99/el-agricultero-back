import { Module } from '@nestjs/common';
import { DocumentsModule } from './documents/documents.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DocumentsModule, UserModule]
})
export class ApiModule {}
