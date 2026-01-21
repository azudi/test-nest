import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import axios from "axios";
import { Model } from "mongoose";
import { Transaction } from "src/transaction/transaction.schema";
import { VerifyTransactionDto } from "./dto/paystack.dto";
import { checkIdIsValid } from "src/helper";

@Injectable()

export class PaystackService {
    constructor(
        private readonly configService: ConfigService,
        @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    ) { }

    async updatetransaction(transactionId: string, response: any) {
        const transaction = await this.transactionModel.findByIdAndUpdate(transactionId, {
            status: response.status,
            refrence: response.reference,
            paymentId: response.id,
            updatedAt: new Date().toISOString(),
        });
        if (!transaction) {
            throw new HttpException('Transaction not found', 404);
        }
    }

    async verifyTransaction({ reference, transactionId }: VerifyTransactionDto) {
        checkIdIsValid(transactionId);
        try {
            const response = await axios.get(
                `https://api.paystack.co/transaction/verify/${reference}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.configService.get('paystack.secrete_key')}`,
                    },
                },
            );
            await this.updatetransaction(transactionId, response.data.data);
            return { message: 'Transaction verified successfully'};
        } catch (error) {
            throw new HttpException(error.response?.data?.message, 400);
        }
    }
}