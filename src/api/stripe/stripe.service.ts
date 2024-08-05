// import { HttpStatus, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import Stripe from 'stripe';
// import { FindOptionsWhere, Repository } from 'typeorm';
//
// import { Either } from '@common/generics/Either';
// import StripeService from '@common/stripe/stripe.service';
// import { CreditType } from '@common/types/credit-type.enum';
// import { PaymentMethod } from '@common/types/payment-method.type';
// import { Status } from '@common/types/Status.type';
// import { AdministrativeCosts } from '@database/entities/administrative_cost.entity';
// import { Price } from '@database/entities/price.entity';
// import { Subscription } from '@database/entities/subscription.entity';
// import { UserSubscription } from '@database/entities/user-subscription.entity';
// import { User } from '@database/entities/user.entity';
// import { CreditsService } from '../credits/credits.service';
// import { CreatePriceDto } from './dto/create-price.dto';
// import { CreateSubscriptionDto } from './dto/create-subscription.dto';
//
// @Injectable()
// export class StripeServices {
//   constructor(
//     private stripeService: StripeService,
//     private creditsService: CreditsService,
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     @InjectRepository(UserSubscription)
//     private userSubscriptionRepository: Repository<UserSubscription>,
//     @InjectRepository(Price)
//     private priceRepository: Repository<Price>,
//     @InjectRepository(Subscription)
//     private subscriptionRepository: Repository<Subscription>,
//     @InjectRepository(AdministrativeCosts)
//     private administrativeCostRepository: Repository<AdministrativeCosts>,
//   ) {}
//
//   async getPrice(where: FindOptionsWhere<Price>[] | FindOptionsWhere<Price>) {
//     const price = await this.priceRepository.findOne({
//       where: { ...where, type: 'one_time' },
//       order: { createdAt: 'DESC' },
//     });
//     if (!price) {
//       return Either.makeLeft('Price not found', HttpStatus.BAD_REQUEST);
//     }
//
//     const credits = await this.administrativeCostRepository.findOne({
//       where: { id: '1192d51e-7ec7-45a1-9651-4a26bca6babd' },
//       select: ['credit_value'],
//     });
//
//     return Either.makeRight({
//       ...price,
//       credit: price.amount / 100 / credits.credit_value,
//     });
//   }
//
//   async getSubscription(
//     where: FindOptionsWhere<Subscription>[] | FindOptionsWhere<Subscription>,
//   ) {
//     const subscription = await this.subscriptionRepository.findOne({
//       where,
//       relations: ['price'],
//     });
//     if (!subscription) {
//       return Either.makeLeft('Subscription not found', HttpStatus.BAD_REQUEST);
//     }
//     return Either.makeRight(subscription);
//   }
//
//   async getPrices() {
//     const list = await this.priceRepository.find({
//       where: { type: 'one_time' },
//       order: { createdAt: 'DESC' },
//     });
//
//     const credits = await this.administrativeCostRepository.findOne({
//       where: { id: '1192d51e-7ec7-45a1-9651-4a26bca6babd' },
//       select: ['credit_value'],
//     });
//
//     return Either.makeRight(
//       list.map((items) => {
//         items['credit'] = items.amount / 100 / credits.credit_value;
//         return items;
//       }),
//     );
//   }
//
//   async getSubscriptions() {
//     const subscriptions = await this.subscriptionRepository.find({
//       relations: ['price'],
//     });
//     return Either.makeRight(subscriptions);
//   }
//
//   async createPrice(body: CreatePriceDto) {
//     const credits = await this.administrativeCostRepository.findOne({
//       where: { id: '1192d51e-7ec7-45a1-9651-4a26bca6babd' },
//       select: ['credit_value'],
//     });
//
//     const productName = `${body.amount / 100 / credits.credit_value} Credits`;
//     const stripePriceResponse = await this.stripeService.createPrice({
//       amount: body.amount,
//       productName,
//       currency: 'usd',
//     });
//     if (stripePriceResponse.isLeft()) {
//       return stripePriceResponse;
//     }
//
//     const stripePrice = stripePriceResponse.getRight();
//
//     const exist = await this.priceRepository.findOne({
//       where: { amount: body.amount },
//     });
//     if (exist) {
//       return Either.makeRight({ price: exist, stripePrice });
//     }
//
//     const newPrice = new Price();
//     newPrice.amount = body.amount;
//     newPrice.name = productName;
//     newPrice.image = body.image;
//     newPrice.status = Status.active;
//     newPrice.type = 'one_time';
//     newPrice.stripeId = stripePrice.id;
//
//     return Either.makeRight({
//       price: await this.priceRepository.save(newPrice),
//       stripePrice,
//     });
//   }
//
//   async createSubscription(body: CreateSubscriptionDto) {
//     const stripePriceResponse = await this.stripeService.createPrice({
//       amount: body.amount,
//       productName: body.name,
//       currency: 'usd',
//       recurring: {
//         interval: body.recurringInterval,
//       },
//     });
//     if (stripePriceResponse.isLeft()) {
//       return stripePriceResponse;
//     }
//
//     const stripePrice = stripePriceResponse.getRight();
//
//     let price = await this.priceRepository.findOne({
//       where: { amount: body.amount, type: 'recurring' },
//     });
//     if (!price) {
//       price = new Price();
//       price.amount = body.amount;
//       price.name = body.name;
//       price.image = body.image;
//       price.status = Status.active;
//       price.type = 'recurring';
//       price.stripeId = stripePrice.id;
//       await this.priceRepository.save(price);
//     }
//
//     const subscription = new Subscription();
//     subscription.name = body.name;
//     subscription.description = body.description;
//     subscription.credits = body.credits;
//     subscription.price = price;
//     subscription.recurringInterval = body.recurringInterval;
//     await this.subscriptionRepository.save(subscription);
//
//     return Either.makeRight({ subscription, price, stripePrice });
//   }
//
//   async handleSubscription(session: Stripe.Checkout.Session) {
//     const stripeSubscription =
//       await this.stripeService._stripe.subscriptions.retrieve(
//         session.subscription as string,
//       );
//
//     const user = await this.userRepository.findOne({
//       where: { customerId: stripeSubscription.customer as string },
//     });
//
//     const subscription = await this.subscriptionRepository.findOne({
//       where: {
//         price: { stripeId: stripeSubscription.items.data[0]?.price?.id },
//       },
//     });
//
//     if (!user || !subscription) {
//       return Either.makeRight({ user, subscription });
//     }
//
//     let userSubscription = await this.userSubscriptionRepository.findOne({
//       where: { stripeSubscriptionId: stripeSubscription.id },
//     });
//
//     if (!userSubscription) {
//       userSubscription = new UserSubscription();
//       userSubscription.user = user;
//       userSubscription.subscription = subscription;
//       userSubscription.stripeSubscriptionId = stripeSubscription.id;
//     }
//     userSubscription.stripePeriodEnd = new Date(
//       stripeSubscription.current_period_end * 1000,
//     );
//     userSubscription.status = Status.active;
//
//     await this.userSubscriptionRepository.save(userSubscription);
//
//     await this.creditsService.addCredits({
//       user,
//       reference: session.id,
//       amount: subscription.credits,
//       paymentMethod: PaymentMethod.stripe,
//       type: CreditType.credit,
//       rate: 1,
//     });
//
//     return Either.makeRight({ user, subscription, userSubscription });
//   }
//
//   async handlePaymentFailed(session: Stripe.Checkout.Session) {
//     const stripeSubscription =
//       await this.stripeService._stripe.subscriptions.retrieve(
//         session.subscription as string,
//       );
//
//     const userSubscription = await this.userSubscriptionRepository.findOne({
//       where: { stripeSubscriptionId: stripeSubscription.id },
//     });
//
//     if (!userSubscription) {
//       return Either.makeRight({ userSubscription });
//     }
//
//     userSubscription.status = Status.paymentFailed;
//     userSubscription.recoverUrl = session['hosted_invoice_url'];
//     await this.userSubscriptionRepository.save(userSubscription);
//     return Either.makeRight({ userSubscription });
//   }
//
//   async cancelSubscription(body: { id: string; user: User }) {
//     const userSubscription = await this.userSubscriptionRepository.findOne({
//       where: { user: { id: body.user.id }, id: body.id },
//       relations: ['subscription.price'],
//     });
//     if (!userSubscription) {
//       return Either.makeLeft('Subscription not found', HttpStatus.BAD_REQUEST);
//     }
//
//     const stripeResponse = await this.stripeService.cancelSubscription(
//       userSubscription.stripeSubscriptionId,
//     );
//     if (stripeResponse.isLeft()) {
//       return stripeResponse;
//     }
//
//     userSubscription.status = Status.cancelled;
//
//     await this.userSubscriptionRepository.save(userSubscription);
//
//     return Either.makeRight('OK');
//   }
//
//   async handlePayment(session: Stripe.Checkout.Session) {
//     const user = await this.userRepository.findOne({
//       where: { customerId: session.customer as string },
//     });
//     if (!user) {
//       return Either.makeRight({ user });
//     }
//
//     const creditValue = await this.administrativeCostRepository.findOne({
//       where: { id: '1192d51e-7ec7-45a1-9651-4a26bca6babd' },
//     });
//     const amount =
//       Number(session.amount_total) / (creditValue.credit_value * 100);
//
//     await this.creditsService.addCredits({
//       user,
//       reference: session.id,
//       amount: amount,
//       paymentMethod: PaymentMethod.stripe,
//       type: CreditType.credit,
//       rate: creditValue.credit_value,
//     });
//     return Either.makeRight({ user, amount });
//   }
// }
