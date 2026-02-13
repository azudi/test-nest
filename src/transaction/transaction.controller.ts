import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { TransactionService } from "./transaction.service";
import { CreateTransactionDto } from "./dto/transaction.dto";
import { RolesGuard } from "src/common/guards/roles.guard";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

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

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Post('')
    createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
        return this.transactionService.createTransaction(createTransactionDto);
    };


    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getTransactionById(@Param('id') id: string) {
        return this.transactionService.getTransactionById(id);
    };

}