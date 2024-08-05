import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserTypeEnum } from 'src/common/enums/user-type.enum';
import { Either } from 'src/common/generics/either';
import { File, FileDocument } from 'src/database/schemas/file.schema';
import { Subscription } from 'src/database/schemas/subscription.schema';
import { UserDocument } from 'src/database/schemas/user.schema';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(File.name)
    private fileModel: Model<File>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
  ) {}

  async findAll() {
    return Either.makeRight<Error, FileDocument[]>(await this.fileModel.find());
  }

  async findOne({ user, _id }: { user: UserDocument; _id: string }) {
    const document = await this.fileModel.findOne({ _id }).populate('plans');
    if (!document)
      return Either.makeLeft<HttpException, FileDocument>(
        new HttpException('Document not found', HttpStatus.NOT_FOUND),
      );

    let validSubscription = false;
    if (user.type === UserTypeEnum.ADMIN) {
      validSubscription = true;
    } else {
      validSubscription = document.plans.some((plan) =>
        plan._id.equals(user.subscription._id),
      );
    }
    if (validSubscription) {
      const { media } = await this.fileModel.findOne({ _id }, { media: 1 });
      document.media = media;
    }
    return Either.makeRight<HttpException, FileDocument>(document);
  }

  async addPlan(_id: string, planId: string) {
    const subscription = await this.subscriptionModel.findOne({ _id: planId });
    if (!subscription)
      return Either.makeLeft<HttpException, FileDocument>(
        new HttpException('Subscription not found', HttpStatus.NOT_FOUND),
      );

    const document = await this.fileModel.findOne({ _id }).populate('plans');
    if (!document)
      return Either.makeLeft<HttpException, FileDocument>(
        new HttpException('Document not found', HttpStatus.NOT_FOUND),
      );
    document.plans.push(subscription);

    return Either.makeRight<HttpException, FileDocument>(await document.save());
  }

  async removePlan(_id: string, planId: string) {
    const subscription = await this.subscriptionModel
      .findOne({ _id: planId })
      .populate('plans');
    if (!subscription)
      return Either.makeLeft<HttpException, FileDocument>(
        new HttpException('Subscription not found', HttpStatus.NOT_FOUND),
      );

    const document = await this.fileModel.findOne({ _id }).populate('plans');
    if (!document)
      return Either.makeLeft<HttpException, FileDocument>(
        new HttpException('Document not found', HttpStatus.NOT_FOUND),
      );
    document.plans = document.plans.filter((plan) => !plan._id.equals(planId));

    return Either.makeRight<HttpException, FileDocument>(await document.save());
  }
}
