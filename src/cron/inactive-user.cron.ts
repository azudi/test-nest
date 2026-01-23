import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from '../mail/mail.service';
import { Auth } from 'src/auth/auth.schema';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class InactiveUserCron {
    private readonly logger = new Logger(InactiveUserCron.name);
    private readonly BATCH_SIZE = 200;
    private readonly LOCK_KEY = 'cron:inactive-users';
    private readonly LOCK_TTL = 1000 * 60 * 30; 

    constructor(
        @InjectModel(Auth.name) private authModel: Model<Auth>,
        private mailService: MailService,
        @Inject('CACHE_MANAGER') private cache: Cache,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handleInactiveUsers() {
        const lock = await this.cache.get(this.LOCK_KEY);
        if (lock) {
            this.logger.warn('Inactive user cron already running');
            return;
        }

        await this.cache.set(this.LOCK_KEY, true, this.LOCK_TTL);

        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            while (true) {
                const users = await this.authModel.find({
                    lastActive: { $lte: thirtyDaysAgo },
                    isActive: true,
                    inactiveEmailSent: false,
                    inactiveEmailProcessing: false,
                })
                    .limit(this.BATCH_SIZE)
                    .lean();

                if (!users.length) break;

                const ids = users.map(u => u._id);

                await this.authModel.updateMany(
                    { _id: { $in: ids } },
                    { $set: { inactiveEmailProcessing: true } },
                );

                await Promise.allSettled(
                    users.map(user => this.mailService.sendInactiveUserEmail(user.email)),
                );


                await this.authModel.updateMany(
                    { _id: { $in: ids } },
                    {
                        $set: {
                            inactiveEmailSent: true,
                            inactiveEmailProcessing: false,
                        },
                    },
                );

                this.logger.log(`Processed ${ids.length} inactive users`);
            }

        } catch (err) {
            this.logger.error('Inactive user cron failed', err);
        } finally {
            await this.cache.del(this.LOCK_KEY);
        }
    }
}
