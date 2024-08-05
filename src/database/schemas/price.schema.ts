import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PriceTypeEnum } from 'src/common/enums/price-type.enum';
import { PriceRecurringI } from '../interfaces/price-recurring.interface';

export type PriceDocument = HydratedDocument<Price>;

@Schema({ timestamps: true })
export class Price {
  @Prop()
  stripePriceId: string;

  @Prop()
  name: string;

  @Prop()
  currency: string;

  @Prop()
  amount: number;

  @Prop()
  type: PriceTypeEnum;

  @Prop({ type: SchemaFactory.createForClass(PriceRecurringI) })
  recurring: PriceRecurringI;
}

export const PriceSchema = SchemaFactory.createForClass(Price);
