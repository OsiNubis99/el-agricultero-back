// import { AuthRequest } from '@common/decorators/auth-request';
// import { BasicRequest } from '@common/decorators/basic-request';
// import {
//   Body,
//   Controller,
//   Get,
//   HttpStatus,
//   Param,
//   Post,
//   RawBodyRequest,
//   Req,
//   Request,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { ApiTags } from '@nestjs/swagger';
// import { Request as ExpressRequest } from 'express';
// import Stripe from 'stripe';
//
// import { Either } from '@common/generics/Either';
// import StripeService from '@common/stripe/stripe.service';
// import { UserRol } from '@common/types/UserRoles.type';
// import { User } from '@database/entities/user.entity';
// import { StripeCreditsDto } from '@user/dto/credits.dto';
// import { CreatePriceDto } from './dto/create-price.dto';
// import { CreateSubscriptionDto } from './dto/create-subscription.dto';
// import { CreateSessionServices } from './services/create-session.service';
// import { StripeServices } from './stripe.service';
//
// @ApiTags('stripe')
// @Controller('stripe')
// export class StripeController {
//   constructor(
//     private configService: ConfigService,
//     private createSessionService: CreateSessionServices,
//     private stripeService: StripeService,
//     private stripeServices: StripeServices,
//   ) {}
//
//   @Post('/webhook')
//   @BasicRequest({
//     description: '',
//     response: '',
//   })
//   async webhook(@Req() request: RawBodyRequest<ExpressRequest>) {
//     const body = request.rawBody.toString();
//     const sig = request.headers['stripe-signature'];
//     const stream = await this.configService.get('stripe.endpoint_secret');
//
//     let event: Stripe.Event;
//     let session: Stripe.Checkout.Session;
//
//     try {
//       event = this.stripeService._stripe.webhooks.constructEvent(
//         body,
//         sig,
//         stream,
//       );
//       session = event.data.object as Stripe.Checkout.Session;
//     } catch (error) {
//       return Either.makeLeft('bad_request', HttpStatus.BAD_REQUEST);
//     }
//
//     if (event.type === 'checkout.session.completed') {
//       // if (session.mode === 'subscription') {
//       //   return this.stripeServices.handleSubscription(session);
//       // }
//       if (session.mode === 'payment') {
//         return this.stripeServices.handlePayment(session);
//       }
//     }
//
//     if (event.type === 'invoice.payment_succeeded' && session.subscription) {
//       return this.stripeServices.handleSubscription(session);
//     }
//
//     if (event.type === 'invoice.payment_failed' && session.subscription) {
//       return this.stripeServices.handlePaymentFailed(session);
//     }
//     return Either.makeRight('');
//   }
//
//   @Post('/session-url')
//   @AuthRequest({
//     description: '',
//     response: '',
//   })
//   sessionUrl(
//     @Request() { user }: { user: User },
//     @Body() body: StripeCreditsDto,
//   ) {
//     return this.createSessionService.execute({ user, ...body });
//   }
//
//   @Get('/price/:id')
//   @BasicRequest({
//     description: 'Validate bearer Token',
//     response: 'credit List',
//   })
//   async getById(@Param('id') id: string) {
//     return this.stripeServices.getPrice({ id });
//   }
//
//   @Get('/subscriptions/:id')
//   @BasicRequest({
//     description: 'Validate bearer Token',
//     response: 'credit List',
//   })
//   async getSubscriptionsById(@Param('id') id: string) {
//     return this.stripeServices.getSubscription({ id });
//   }
//
//   @Post('/userSubscription/cancel/:id')
//   @AuthRequest({
//     description: 'Validate bearer Token',
//     response: 'credit List',
//   })
//   async cancelSubscription(
//     @Request() { user }: { user: User },
//     @Param('id') id: string,
//   ) {
//     return this.stripeServices.cancelSubscription({ user, id });
//   }
//
//   @Get('/price')
//   @BasicRequest({
//     description: 'Validate bearer Token',
//     response: 'credit List',
//   })
//   async getAll() {
//     return this.stripeServices.getPrices();
//   }
//
//   @Get('/subscriptions')
//   @BasicRequest({
//     description: 'Validate bearer Token',
//     response: 'credit List',
//   })
//   async getSubscriptions() {
//     return this.stripeServices.getSubscriptions();
//   }
//
//   @Post('/price')
//   @AuthRequest({
//     description: 'Validate bearer Token',
//     response: 'Create new price',
//     roles: [UserRol.admin],
//   })
//   async createPrice(@Body() body: CreatePriceDto) {
//     return this.stripeServices.createPrice(body);
//   }
//
//   @Post('/subscription')
//   @AuthRequest({
//     description: 'Validate bearer Token',
//     response: 'Create new subscription',
//     roles: [UserRol.admin],
//   })
//   async createSubscription(@Body() body: CreateSubscriptionDto) {
//     return this.stripeServices.createSubscription(body);
//   }
// }
