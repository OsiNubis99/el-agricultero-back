import { Price } from 'src/database/schemas/price.schema';

export class CreatePriceDto {
  amount: Price['amount'];
  currency: Price['currency'];
  name: Price['name'];
  recurring?: Price['recurring'];
}
