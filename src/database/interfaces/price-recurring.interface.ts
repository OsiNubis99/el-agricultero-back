import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: true })
export class PriceRecurringI {
  @Prop()
  interval: 'day' | 'week' | 'month' | 'year';

  @Prop()
  interval_count: number;
}
