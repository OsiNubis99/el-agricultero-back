import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { CreateDocumentService } from './services/create-document.service';

@Module({
  imports: [CommonModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, CreateDocumentService],
})
export class DocumentsModule {}
