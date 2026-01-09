
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { CreateUserSettingsDto } from 'src/user-settings/dto/user-settings.dto';
import { RolesType } from 'src/constant/role';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    displayName?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    role?: RolesType;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateUserSettingsDto)
    settings?: CreateUserSettingsDto;
}


export class VerifyEmailDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

}

export class VerifyEmailCodeDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;


    @IsNotEmpty()
    code: string | number;
}