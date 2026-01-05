import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { ForgotPasswordDto, VerifyCodeDto } from "./dto/forgot-password.dto";

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

    @Get('users')
    getAllusers() {
        console.log(process.env.SECRETE_KEY_JWT)
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
}