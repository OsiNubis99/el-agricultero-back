import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { StatusEnum } from 'src/common/enums/status.enum';

export type EmailCodeDocument = HydratedDocument<EmailCode>;

@Schema({ timestamps: true })
export class EmailCode {
  @Prop({
    enum: StatusEnum,
    default: StatusEnum.INACTIVE,
  })
  status: StatusEnum;

  @Prop({
    unique: true,
  })
  email: string;

  @Prop()
  code: string;
}

export const EmailCodeSchema = SchemaFactory.createForClass(EmailCode);
