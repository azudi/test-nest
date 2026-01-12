import { Module } from "@nestjs/common";
import { paystackController } from "./paystack.controller";
import { PaystackService } from "./paystack.service";

@Module({
     controllers: [paystackController],
     providers: [PaystackService]
})
export class PaystackModule {}