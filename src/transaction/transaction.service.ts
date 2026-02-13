import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Transaction } from "./transaction.schema";
import { Model } from "mongoose";
import { checkIdIsValid } from "src/helper";
import { CreateTransactionDto } from "./dto/transaction.dto";


@Injectable()

export class TransactionService {
    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<Transaction>
    ) { }
    test(): string {
        return "Transaction Service is working!";
    }

    async rest() {
        const rest = ""
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