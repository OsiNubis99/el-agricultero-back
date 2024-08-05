import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { DatabaseConfig } from './config/database-config';
import { JWTConfig } from './config/jwt-config';
import { MailerConfig } from './config/mailer-config';
import { ServerConfig } from './config/server-config';
import { StripeConfig } from './config/stripe-api-config';

@Module({
  imports: [
    ApiModule,
    ConfigModule.forRoot({
      load: [
        DatabaseConfig,
        JWTConfig,
        MailerConfig,
        ServerConfig,
        StripeConfig,
      ],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
