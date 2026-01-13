import { Module } from "@nestjs/common";
import { paystackController } from "./paystack.controller";
import { PaystackService } from "./paystack.service";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Transaction, TransactionSchema } from "src/transaction/transaction.schema";
import { TransactionModule } from "src/transaction/transaction.module";

@Module({
     imports: [
          ConfigModule,
          TransactionModule,
          MongooseModule.forFeature([
               {
                    name: Transaction.name,
                    schema: TransactionSchema
               }
          ])
     ],
     controllers: [paystackController],
     providers: [PaystackService]
})
export class PaystackModule { }