import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppServiceI } from 'src/common/generics/app-service.interface';
import { Either } from 'src/common/generics/either';
import { File, FileDocument } from 'src/database/schemas/file.schema';
import { CreateDocumentDto } from '../dto/create-document.dto';

type P = CreateDocumentDto;

type L = HttpException;

type R = FileDocument;

@Injectable()
export class CreateDocumentService implements AppServiceI<P, L, R> {
  constructor(
    @InjectModel(File.name)
    private fileModel: Model<File>,
  ) {}

  async execute(body: P) {
    const file = new this.fileModel({
      name: body.name,
      media: body.media,
      picture: body.picture,
    });

    await file.save();

    return Either.makeRight<L, R>(file);
  }
}
