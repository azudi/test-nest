
import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';


export class IncomingMessageDto {
    @IsString()
    @IsOptional()
    senderId: string;

    @IsString()
    @IsOptional()
    receiverId: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    read: boolean;

    @IsOptional()
    createdAt?: boolean;

    @IsOptional()
    updatedAt?: boolean;
}