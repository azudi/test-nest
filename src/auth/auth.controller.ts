import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, VerifyEmailCodeDto, VerifyEmailDto } from "./dto/create-user.dto";
import { UpdateUserDto, UpdateUserPasswordDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { ForgotPasswordDto, ResetPasswordDto, VerifyCodeDto } from "./dto/forgot-password.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Role } from "src/common/enums/roles.enum";

@Controller('auth')

@UsePipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }),
)

export class AuthController {
    constructor(private authService: AuthService) { }


    @Get('test')
    test() {
        return this.authService.test();
    };

    @Post('signup')
    signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.signup(createUserDto);
    };

    @Post('signin')
    signin(@Body() loginUserDto: LoginUserDto) {
        return this.authService.signin(loginUserDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Get('users')
    getAllusers() {
        return this.authService.getAllUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/:id')
    getAlluserById(@Param('id') id: string) {
        return this.authService.getAllUserById(id);
    }

    @Patch('user/:id')
    updateUser(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto) {
        return this.authService.updateUser(UpdateUserDto, id)
    }

    @Delete('user/:id')
    deleteUser(@Param('id') id: string) {
        return this.authService.deleteUser(id)
    }

    @Post('forgot-password')
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto)
    }

    @Post('verify-code')
    verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
        return this.authService.verifyCode(verifyCodeDto)
    }

    @Post('verify-email')
    verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto)
    }

    @Post('verify-email-code')
    verifyEmailCode(@Body() verifyEmailCodeDto: VerifyEmailCodeDto) {
        return this.authService.verifyEmailCode(verifyEmailCodeDto)
    }

    @Patch('update-password/:id')
    updatePassword(@Param('id') id: string, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
        return this.authService.updateUserPassword(updateUserPasswordDto, id)
    }

    @Post('reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.updateForgotpassword(resetPasswordDto)
    }

    @Get('health/redis')
    async redisHealth() {
        return {
            redis: await this.authService.isRedisUp(),
        };
    }
}