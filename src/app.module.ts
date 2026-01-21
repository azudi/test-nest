import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from "./config/config"
import { BlogModule } from './blog/blog.module';
import { MailModule } from './mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet'
import { UploadModule } from './upload/upload.module';
import { PaystackModule } from './paystack/paystack.module';
import { TransactionModule } from './transaction/transaction.module';
import { ScheduleModule } from '@nestjs/schedule';



@Module({
  imports: [
    AuthModule,
    UserModule,
    BlogModule,
    UploadModule,
    PaystackModule,
    TransactionModule,
    ScheduleModule.forRoot(),
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
        // url: configService.get<string>('redis.url'),
        url: `redis://redis:6379`,
        // ttl: configService.get<number>('redis.ttl'),
        ttl: 60,
        // host: configService.get<string>('redis.host') ,
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
