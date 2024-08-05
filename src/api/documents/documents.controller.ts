import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/common/decorators/auth-request';
import { BasicRequest } from 'src/common/decorators/basic-request';
import { UserD } from 'src/common/decorators/user.decorator';
import { IdDto } from 'src/common/dtos/id.dto';
import { UserTypeEnum } from 'src/common/enums/user-type.enum';
import { UserDocument } from 'src/database/schemas/user.schema';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ModifyPlansDto } from './dto/modify-plans.dto';
import { CreateDocumentService } from './services/create-document.service';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly createDocumentService: CreateDocumentService,
    private readonly documentsService: DocumentsService,
  ) {}

  @Post()
  @AuthRequest({
    description: 'Create a document',
    response: 'New document created',
    roles: [UserTypeEnum.ADMIN],
  })
  create(@Body() body: CreateDocumentDto) {
    return this.createDocumentService.execute(body);
  }

  @Get()
  @BasicRequest({
    description: 'Get all documents',
    response: 'All documents',
  })
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':_id')
  @AuthRequest({
    description: 'Get all documents',
    response: 'Document data',
  })
  findOne(@UserD() user: UserDocument, @Param() { _id }: IdDto) {
    return this.documentsService.findOne({ user, _id });
  }

  @Post(':_id/plan')
  @AuthRequest({
    description: 'Add plan to document',
    response: 'Document data',
  })
  addPlan(@Param() { _id }: IdDto, @Body() body: ModifyPlansDto) {
    return this.documentsService.addPlan(_id, body.planId);
  }

  @Delete(':_id/plan')
  @AuthRequest({
    description: 'Remove plan from document',
    response: 'Document data',
  })
  removePlan(@Param() { _id }: IdDto, @Body() body: ModifyPlansDto) {
    return this.documentsService.removePlan(_id, body.planId);
  }
}
