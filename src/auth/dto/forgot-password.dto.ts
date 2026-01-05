
import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';

export class ForgotPasswordDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class VerifyCodeDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    

    @IsNotEmpty()
    code: string | number;
}