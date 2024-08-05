import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';
import { Price, PriceDocument } from './price.schema';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({ timestamps: true })
export class Subscription {
  @Prop()
  name: string;

  @Prop()
  picture: string;

  @Prop()
  description: string;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: Price.name })
  price: PriceDocument;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

const autoPopulate = function (next) {
  this.populate('price');
  next();
};

SubscriptionSchema.pre('findOne', autoPopulate).pre('find', autoPopulate);
