import { Price } from 'src/database/schemas/price.schema';
import { User } from 'src/database/schemas/user.schema';

export class CreateSessionDto {
  customerId: User['stripeCustomerId'];
  priceId: Price['stripePriceId'];
  mode: 'payment' | 'subscription';
}
