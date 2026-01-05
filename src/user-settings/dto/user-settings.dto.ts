
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateUserSettingsDto {
    @IsBoolean()
    @IsOptional()
    emailNotification?: boolean;

    @IsBoolean()
    @IsOptional()
    pushNotification?: boolean;

    @IsBoolean()
    @IsOptional()
    smsNotofication?: boolean;
}