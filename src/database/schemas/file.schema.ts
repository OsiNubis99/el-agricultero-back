import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';
import { Subscription, SubscriptionDocument } from './subscription.schema';

export type FileDocument = HydratedDocument<File>;

@Schema({ timestamps: true })
export class File {
  @Prop()
  name: string;

  @Prop({ select: false })
  media: string;

  @Prop()
  picture: string;

  @Prop({ type: [mongooseSchema.Types.ObjectId], ref: Subscription.name })
  plans: SubscriptionDocument[];
}

export const FileSchema = SchemaFactory.createForClass(File);
