import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Auth, SignInAuth, Verification } from "./auth.schema";
import mongoose, { Model, ObjectId, Types } from "mongoose";
import { responseConst } from "src/constants/response.const";
import { UpdateUserDto } from "./dto/update-user.dto";
import { checkIdIsValid, checkIdResponseIsValid, generateHashedPassword } from "src/helper";
import { LoginUserDto } from "./dto/login.dto";
import * as bcrypt from 'bcrypt';
import { UserSettings } from "src/user-settings/userSettings.schema";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "src/mail/mail.service";
import { ForgotPasswordDto, VerifyCodeDto } from "./dto/forgot-password.dto";
import { generateCode } from "src/utils/helper";

@Injectable()

export class AuthService {
    constructor(
        @InjectModel(Auth.name) private authModel: Model<Auth>,
        @InjectModel(SignInAuth.name) private SignInAuth: Model<SignInAuth>,
        @InjectModel(Verification.name) private verificationModel: Model<Verification>,
        @InjectModel(UserSettings.name) private userSettingsModel: Model<UserSettings>,
        private readonly JwtService: JwtService,
        private mailService: MailService,
    ) { }


    async test() {
        await this.mailService.sendPasswordUpdateSuccess("jerryazubuike002@gmail.com");
    }

    async hashCode(code: string) {
        return bcrypt.hash(code, 10);
    }

    async verifyCode({ email, code }: VerifyCodeDto) {
        const verification = await this.verificationModel.findOne({ email });
        if (!verification) {
            throw new HttpException("Invalid or expired code", HttpStatus.UNAUTHORIZED);
        }

        const isCodeValid = await bcrypt.compare(code.toString(), verification.codeHash);
        if (!isCodeValid) {
            throw new HttpException("Invalid or expired code", HttpStatus.UNAUTHORIZED);
        }

        if (verification.expiresAt < new Date()) {
            throw new HttpException("Invalid or expired code", HttpStatus.UNAUTHORIZED);
        }

        await this.verificationModel.deleteOne({ email });
        return { message: 'Code validated successfully' };

    }

    async forgotPassword({ email }: ForgotPasswordDto) {
        const user = await this.authModel.findOne({ email: email.toLowerCase().trim() });
        const code = generateCode(6);
        const codeHash = await this.hashCode(code);

        if (!user) {
            throw new HttpException(
                `User does not Exist`,
                404,
            );
        }

        await this.verificationModel.deleteMany({ email });
        await this.verificationModel.create({
            email,
            codeHash,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        });

        await this.mailService.sendResetCodeEmail(email, code);
        return { message: 'Code sent to email' };

    }

    async signin(loginUserDto: LoginUserDto) {
        const user = await this.authModel.findOne({
            email: loginUserDto.email.toLowerCase().trim(),
        }).select('+password');

        const invalidCredentialsMessage = 'Invalid email or password';
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(
            loginUserDto.password,
            user.password,
        );
        if (!passwordMatch) {
            throw new UnauthorizedException(invalidCredentialsMessage);
        }
        return {
            access_token: this.loginEncryptedUser(user._id),
            userId: user._id
        }
    }

    getAllUsers() {
        return this.authModel.find()
    }

    async getAllUserById(id: string) {
        checkIdIsValid(id)
        const finduser = await this.authModel.findById(id).populate("settings");
        if (!finduser) throw new HttpException("User not found", 404)
        return finduser
    }

    async signup({ settings, ...createUserDto }: CreateUserDto) {
        let savedUserSettings

        if (settings) {
            savedUserSettings = await new this.userSettingsModel(settings).save();
        }
        const payload = {
            ...createUserDto,
            password: await generateHashedPassword(createUserDto?.password),
            settings: savedUserSettings?._id,
        }
        const newUser = new this.authModel(payload);

        try {
            const { email, _id, displayName } = await newUser.save();
            return { message: "Sign-Up Successful", result: { _id, email, displayName }, status: 201 };
        } catch (error) {
            console.log(error)
            if (error.code === responseConst.DUPLICATE) {
                throw new ConflictException("Email already in use");
            }

            throw new InternalServerErrorException("Signup failed");

        }
    }

    loginEncryptedUser(userId: Types.ObjectId | string) {
        const payload = { sub: userId };
        return this.JwtService.sign(payload);
    }

    async updateUser(updateUserDto: UpdateUserDto, id: string) {
        checkIdIsValid(id)
        const updatedUser = await this.authModel.findByIdAndUpdate(
            id,
            { $set: updateUserDto },
            { new: true, runValidators: true }
        );

        if (updatedUser === null) throw new HttpException('Invalid ID', HttpStatus.NOT_FOUND)
        return updatedUser
    }


    async deleteUser(id: string) {
        checkIdIsValid(id)
        const updatedUser = await this.authModel.findByIdAndDelete(id);
        checkIdResponseIsValid(updatedUser)

        return { message: "User deleted successfully" }
    }
}