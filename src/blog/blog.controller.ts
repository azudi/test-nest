import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { BlogService } from "./blog.service";

import { CreateBlogDto } from "./dto/blog.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

@Controller('blog')

@UsePipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }),
)

export class BlogController {
    constructor(private blogService: BlogService) { }

    @UseGuards(JwtAuthGuard)
    @Post('')
    createBlog(@Body() createBlogDto: CreateBlogDto) {
        return this.blogService.createBlog(createBlogDto);
    };


    @Get('')
    getBlogs() {
        return this.blogService.getBlogs();
    };

    @Delete(':id')
    deleteBlogs(@Param('id') id: string) {
        return this.blogService.deleteBlog(id);
    };

}