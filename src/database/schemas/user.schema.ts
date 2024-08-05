import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';
import { StatusEnum } from 'src/common/enums/status.enum';
import { UserTypeEnum } from 'src/common/enums/user-type.enum';
import { Subscription, SubscriptionDocument } from './subscription.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    enum: UserTypeEnum,
    default: UserTypeEnum.ACCOUNT,
  })
  type: UserTypeEnum;

  @Prop({
    enum: StatusEnum,
    default: StatusEnum.NOT_VALIDATED,
  })
  status: StatusEnum;

  @Prop({
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  name: string;

  @Prop()
  stripeSubscriptionId: string;

  @Prop()
  stripeCustomerId: string;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: Subscription.name })
  subscription: SubscriptionDocument;

  @Prop()
  stripeCurrentPeriodEnd: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
