import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { PaystackService } from "./paystack.service";
import { VerifyTransactionDto } from "./dto/paystack.dto";

@Controller('paystack')

@UsePipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }),
)

export class paystackController {
       constructor( private paystackService: PaystackService) {}

       @Post('verify')
       async verifyTransaction(@Body() verifyTransactionDto: VerifyTransactionDto) {
           return this.paystackService.verifyTransaction(verifyTransactionDto);
       }
       
}