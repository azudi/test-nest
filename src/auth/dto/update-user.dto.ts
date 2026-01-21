
import { Type } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { CreateUserSettingsDto } from 'src/user-settings/dto/user-settings.dto';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    displayName?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateUserSettingsDto)
    settings?: CreateUserSettingsDto;
}


export class UpdateUserPasswordDto {
    @IsString()
    password: string;

    @IsString()
    oldPassword: string;
}