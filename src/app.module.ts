import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from "./config/config"
import { BlogModule } from './blog/blog.module';
import { MailModule } from './mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UploadModule } from './upload/upload.module';
import { PaystackModule } from './paystack/paystack.module';
import { TransactionModule } from './transaction/transaction.module';
import { ScheduleModule } from '@nestjs/schedule';
import Redis from 'ioredis';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';



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
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('redis.url');

        // ---> Redis set up <--- 
        if (!redisUrl) {
          throw new Error('❌ REDIS URL NOT CONFIGURED');
        }

        const redis = new Redis(redisUrl, {
          lazyConnect: false,
          enableOfflineQueue: false,
          maxRetriesPerRequest: 1,
        });

        redis.on('error', (err) => {
          console.error('❌ Redis fatal error:', err.message);
          // process.exit(1);
        });

        redis.once('ready', () => {
          console.log('✅ Redis ready');
        });

        const redisStore = new Keyv({ store: new KeyvRedis({ client: redis } as any), namespace: 'cache', });

        return {
          stores: [redisStore],
          ttl: 30,
        };
      },
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
