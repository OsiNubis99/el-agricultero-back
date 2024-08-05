/* import { Either } from '@common/generics/Either'; */
/* import { IAppService } from '@common/generics/IAppService'; */
/* import StripeService from '@common/stripe/stripe.service'; */
/* import { Price } from '@database/entities/price.entity'; */
/* import { User } from '@database/entities/user.entity'; */
/* import { HttpStatus } from '@nestjs/common'; */
/* import { InjectRepository } from '@nestjs/typeorm'; */
/* import { StripeCreditsDto } from '@user/dto/credits.dto'; */
/* import { Repository } from 'typeorm'; */
/**/
/* type P = { */
/*   user: User; */
/* } & StripeCreditsDto; */
/**/
/* type R = { */
/*   url: string; */
/* }; */
/**/
/* export class CreateSessionServices implements IAppService<P, R> { */
/*   constructor( */
/*     private stripeService: StripeService, */
/*     @InjectRepository(User) */
/*     private userRepository: Repository<User>, */
/*     @InjectRepository(Price) */
/*     private priceRepository: Repository<Price>, */
/*   ) {} */
/**/
/*   async execute({ user, ...body }: P) { */
/*     if (!user) { */
/*       return Either.makeLeft('Something goes wrong', HttpStatus.BAD_REQUEST); */
/*     } */
/**/
/*     const price = await this.priceRepository.findOne({ */
/*       where: { id: body.idPrice }, */
/*       select: ['id', 'stripeId', 'type'], */
/*     }); */
/*     if (!price) { */
/*       return Either.makeLeft('Price not found', HttpStatus.BAD_REQUEST); */
/*     } */
/*     const mode = price.type === 'one_time' ? 'payment' : 'subscription'; */
/*     if (mode !== body.mode) { */
/*       return Either.makeLeft('Price or mode not valid', HttpStatus.BAD_REQUEST); */
/*     } */
/**/
/*     if (!user.customerId) { */
/*       const customerResponse = await this.stripeService.createCustomer( */
/*         user.nickname, */
/*         user.email, */
/*       ); */
/**/
/*       if (customerResponse.isLeft()) { */
/*         return Either.makeLeft( */
/*           customerResponse.getLeft().message, */
/*           HttpStatus.BAD_REQUEST, */
/*         ); */
/*       } */
/*       user.customerId = customerResponse.getRight().id; */
/*       await this.userRepository.save(user); */
/*     } */
/**/
/*     const resp = await this.stripeService.createSession({ */
/*       customerId: user.customerId, */
/*       priceId: price.stripeId, */
/*       mode: body.mode, */
/*     }); */
/*     return resp; */
/*   } */
/* } */
