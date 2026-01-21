import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from '../mail/mail.service';
import { Auth } from 'src/auth/auth.schema';

@Injectable()
export class InactiveUserCron {
    private readonly logger = new Logger(InactiveUserCron.name);

    constructor(
        @InjectModel(Auth.name) private authModel: Model<Auth>,
        private mailService: MailService,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handleInactiveUsers() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const inactiveUsers = await this.authModel.find({
            lastActive: { $lte: thirtyDaysAgo },
            isActive: true,
        });

        this.logger.log(`Found ${inactiveUsers.length} inactive users`);

        for (const user of inactiveUsers) {
            await this.mailService.sendInactiveUserEmail(user.email);
            await this.authModel.updateOne(
                { _id: user._id },
                { $set: { inactiveEmailSent: true } }
            );
        }
    }
}
