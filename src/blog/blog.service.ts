import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Blog } from "./blog.schema";
import mongoose, { Model } from "mongoose";
import { checkIdIsValid, checkIdResponseIsValid, generateHashedPassword } from "src/helper";
import { UserSettings } from "src/user-settings/userSettings.schema";
import { CreateBlogDto } from "./dto/blog.dto";
import { responseConst } from "src/constants/response.const";

@Injectable()

export class BlogService {
    constructor(
        @InjectModel(Blog.name) private blogModel: Model<Blog>
    ) { }


    test(): string {
        return "Blog Service is working!";
    }

    async createBlog(createBlogDto: CreateBlogDto) {
        try {
            await this.blogModel.create(createBlogDto);
            return { message: "Blog Created successfully" }
        } catch (error) {
            if (error.code === responseConst.DUPLICATE) {
                throw new ConflictException("Blog already Created");
            }

            throw new InternalServerErrorException("Blog Creation failed");
        }
    }

    async getBlogs() {
        return await this.blogModel.find();
    }

    async deleteBlog(id: string) {
        checkIdIsValid(id);
        try {
            const deletedBlog = await this.blogModel.findByIdAndDelete(id);
            checkIdResponseIsValid(deletedBlog)

            return { message: "Blog deleted successfully" }
        } catch (error) {
            if (error.code === responseConst.DUPLICATE) {
                throw new ConflictException("Blog already Created");
            }

            throw new InternalServerErrorException("Blog Deleting failed");
        }
    }

}