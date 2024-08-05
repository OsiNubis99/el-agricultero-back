import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MailerModule } from 'src/mailer/mailer.module';
import StripeService from './services/stripe.service';

const commonServices = [StripeService];

@Module({
  imports: [DatabaseModule, MailerModule],
  providers: [...commonServices],
  exports: [...commonServices],
})
export class CommonModule {}
