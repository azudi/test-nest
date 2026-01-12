import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()

export class PaystackService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    async initializeTransaction(email: string, amount: number) {
        // Logic to initialize a transaction with Paystack API
        return {
            status: 'success',
            message: 'Transaction initialized',
            data: {
                authorization_url: 'https://paystack.com/pay/xyz',
                access_code: 'ACCESS_CODE',
                reference: 'TRANSACTION_REFERENCE'
            }
        };
    }

    async verifyTransaction(reference: string) {
        try {
            const response = await axios.get(
                `https://api.paystack.co/transaction/verify/${reference}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.configService.get('paystack.secrete_key')}`,
                    },
                },
            );

            return response.data;
        } catch (error) {
            throw new HttpException(error.response?.data?.message, 400);
        }
    }
}