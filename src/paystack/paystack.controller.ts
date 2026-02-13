import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { PaystackService } from "./paystack.service";
import { VerifyTransactionDto } from "./dto/paystack.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Role } from "src/common/enums/roles.enum";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

@Controller('paystack')

@UsePipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }),
)

export class paystackController {
    constructor(private paystackService: PaystackService) { }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER)
    @Post('verify')
    async verifyTransaction(@Body() verifyTransactionDto: VerifyTransactionDto) {
        return this.paystackService.verifyTransaction(verifyTransactionDto);
    }

}