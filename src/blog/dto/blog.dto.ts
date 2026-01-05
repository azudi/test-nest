
import {
    IsBoolean,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateBlogDto {

    @IsString()
    author: string;

    @IsString()
    content: string;

    @IsString()
    slug: string;
    
    @IsString()
    title: string
}