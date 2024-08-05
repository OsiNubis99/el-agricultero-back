import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          pool: true,
          host: configService.get<string>('mailer.host'),
          port: configService.get<number>('mailer.port'),
          secureConnection: false,
          tls: {
            ciphers: 'SSLv3',
          },
          auth: {
            user: configService.get<string>('mailer.user'),
            pass: configService.get<string>('mailer.pass'),
          },
        },
        defaults: {
          from: '"No Reply" <admin@autosensei.ca>',
        },
        template: {
          dir: 'src/mailer/templates/',
          adapter: new EjsAdapter({ inlineCssEnabled: true }),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class MailerModule {}
