import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { BlogService } from "./blog.service";

import { CreateBlogDto } from "./dto/blog.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/roles.enum";
import { RolesGuard } from "src/common/guards/roles.guard";

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

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @UseGuards(JwtAuthGuard)
    @Post('')
    createBlog(@Body() createBlogDto: CreateBlogDto) {
        return this.blogService.createBlog(createBlogDto);
    };


    @Get('')
    getBlogs() {
        return this.blogService.getBlogs();
    };

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Delete(':id')
    deleteBlogs(@Param('id') id: string) {
        return this.blogService.deleteBlog(id);
    };

}