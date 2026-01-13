import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Transaction } from "./transaction.schema";
import mongoose, { Model } from "mongoose";
import { checkIdIsValid, checkIdResponseIsValid, generateHashedPassword } from "src/helper";
import { UserSettings } from "src/user-settings/userSettings.schema";
import { CreateTransactionDto } from "./dto/transaction.dto";
import { responseConst } from "src/constants/response.const";

@Injectable()

export class TransactionService {
    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<Transaction>
    ) { }


    test(): string {
        return "Transaction Service is working!";
    }

    async createTransaction(createTransactionDto: CreateTransactionDto) {
        try {
            const result = await this.transactionModel.create(createTransactionDto);

            return { ...result.toObject() }
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getTransactionById(id: string) {
        checkIdIsValid(id);
        const transaction = await this.transactionModel.findById(id);
        if (!transaction) {
            throw new HttpException("Transaction not found", HttpStatus.NOT_FOUND);
        }
        return transaction;
    }

}