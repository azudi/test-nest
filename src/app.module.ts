import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from "./config/config"
import { BlogModule } from './blog/blog.module';
import { MailModule } from './mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { UploadModule } from './upload/upload.module';
import { PaystackModule } from './paystack/paystack.module';
import { TransactionModule } from './transaction/transaction.module';



@Module({
  imports: [
    AuthModule,
    UserModule,
    BlogModule,
    UploadModule,
    PaystackModule,
    TransactionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      load: [config],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true, 
      useFactory: (configService: ConfigService) => ({
        store: redisStore as any,
        url: configService.get<string>('redis.url'),
        ttl: configService.get<number>('redis.ttl'),
        host: configService.get<string>('redis.host'),
        isGlobal: true,
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
    MailModule,
  ],
})
export class AppModule { }
