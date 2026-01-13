import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { TransactionService } from "./transaction.service";
import { CreateTransactionDto } from "./dto/transaction.dto";

@Controller('transaction')

@UsePipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }),
)

export class TransactionController {
    constructor(private transactionService: TransactionService) { }

    @UseGuards(JwtAuthGuard)
    @Post('')
    createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
        return this.transactionService.createTransaction(createTransactionDto);
    };

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getTransactionById(@Param('id') id: string) {
        return this.transactionService.getTransactionById(id);
    };

}