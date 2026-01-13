
import {
    IsBoolean,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateTransactionDto {

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    refrence?: string;

    @IsString()
    @IsOptional()
    updatedAt?: string;

    @IsString()
    @IsOptional()
    createdAt?: string;

    @IsString()
    @IsOptional()
    paymentId?: string;
}