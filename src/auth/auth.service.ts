import { ConflictException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto, VerifyEmailCodeDto, VerifyEmailDto } from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Auth, SignInAuth, Verification, VerificationEmail } from "./auth.schema";
import mongoose, { Model, ObjectId, Types } from "mongoose";
import { responseConst } from "src/constants/response.const";
import { UpdateUserDto, UpdateUserPasswordDto } from "./dto/update-user.dto";
import { checkIdIsValid, checkIdResponseIsValid, generateHashedPassword } from "src/helper";
import { LoginUserDto } from "./dto/login.dto";
import * as bcrypt from 'bcrypt';
import { UserSettings } from "src/user-settings/userSettings.schema";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "src/mail/mail.service";
import { ForgotPasswordDto, ResetPasswordDto, VerifyCodeDto } from "./dto/forgot-password.dto";
import { generateCode } from "src/utils/helper";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Roles } from "src/constant/role";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()

export class AuthService {
    constructor(
        @InjectModel(Auth.name) private authModel: Model<Auth>,
        @InjectModel(SignInAuth.name) private SignInAuth: Model<SignInAuth>,
        @InjectModel(Verification.name) private verificationModel: Model<Verification>,
        @InjectModel(UserSettings.name) private userSettingsModel: Model<UserSettings>,
        @InjectModel(VerificationEmail.name) private verificationEmailModel: Model<VerificationEmail>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly JwtService: JwtService,
        private mailService: MailService,
    ) { }


    async isRedisUp(): Promise<boolean> {
        try {
            await this.cacheManager.set('health:ping', 'pong', 5);
            const value = await this.cacheManager.get('health:ping');
            return value === 'pong';
        } catch (err) {
            return false;
        }
    }

    async test() {
        const cached = await this.cacheManager.get(`user:test`);
        await this.cacheManager.set(`user:test`, { message: "test" }, 6000);
        if (cached) {
            return cached;
        }
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

        // await this.verificationModel.deleteOne({ email });
        await this.verificationModel.updateOne(
            { email },
            {
                $set: {
                    used: true,
                    expiresAt: new Date(),
                },
            }
        );
        return { message: 'Code validated successfully' };
    }

    async checkIsEmailVeried(email: string) {
        const verification = await this.verificationEmailModel.findOne({ email });
        if (!verification || !verification.used) {
            throw new HttpException("Email not verified", HttpStatus.UNAUTHORIZED);
        }
        return
    }

    async updateForgotpassword({ email, password }: ResetPasswordDto) {
        const verification = await this.verificationModel.findOne({ email });
        if (!verification?.used) {
            throw new HttpException("Please verify code", HttpStatus.UNAUTHORIZED);
        }

        if (!verification.used) {
            throw new HttpException("Code not verified", HttpStatus.UNAUTHORIZED);
        }

        const hashedPassword = await generateHashedPassword(password as string);

        const updatedUser = await this.authModel.findOneAndUpdate(
            { email: email },
            { $set: { password: hashedPassword } },
            { new: true, runValidators: true }
        );

        if (updatedUser === null) throw new HttpException('Invalid Email', HttpStatus.NOT_FOUND)
        await this.verificationModel.deleteOne({ email });

        await this.mailService.sendPasswordUpdateSuccess(email);

        return { message: 'Password updated successfully' };
    }

    async verifyEmailCodeFunc({ email, code }: { email: string; code?: string | number }) {
        const verification = await this.verificationEmailModel.findOne({ email });

        if (!verification) {
            throw new HttpException("Invalid or expired code", HttpStatus.UNAUTHORIZED);
        }


        const isCodeValid = code && await bcrypt.compare(code?.toString(), verification.codeHash);
        if (!isCodeValid && code) {
            throw new HttpException("Invalid or expired code", HttpStatus.UNAUTHORIZED);
        }

        if (verification.expiresAt < new Date()) {
            throw new HttpException("Invalid or expired code", HttpStatus.UNAUTHORIZED);
        }

        return verification
    }

    async verifyEmailCode({ email, code }: VerifyEmailCodeDto) {
        this.verifyEmailCodeFunc({ email, code });

        // await this.verificationEmailModel.deleteOne({ email });
        await this.verificationEmailModel.updateOne(
            { email },
            {
                $set: {
                    used: true,
                    expiresAt: new Date(),
                },
            }
        );
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

    async verifyEmail({ email }: VerifyEmailDto) {
        const verification = await this.verificationEmailModel.findOne({ email: email.toLowerCase().trim() });
        const code = generateCode(6);
        const codeHash = await this.hashCode(code);

        if (verification) {
            await this.verificationEmailModel.deleteMany({ email });
        }

        await this.verificationEmailModel.create({
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

    async getAllUsers() {
        // await this.authModel.updateMany(
        //     { role: { $exists: false }, isActive: { $exists: false } },
        //     { $set: { role: Roles.USER, isActive: true } }
        // );
        return this.authModel.find()
    }

    async getAllUserById(id: string) {
        checkIdIsValid(id)
        const finduser = await this.authModel.findById(id).populate("settings");
        if (!finduser) throw new HttpException("User not found", 404)
        return finduser
    }

    async signup({ settings, ...createUserDto }: CreateUserDto) {
        let savedUserSettings;
        const verification = await this.verificationEmailModel.findOne({ email: createUserDto.email });
        if (!verification || !verification.used) {
            throw new HttpException("Email not verified", HttpStatus.UNAUTHORIZED);
        }


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
            await this.verificationEmailModel.deleteOne({ email })
            return { message: "Sign-Up Successful", result: { _id, email, displayName }, status: 201 };
        } catch (error) {
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

    async updateUserPassword(updateUserPasswordDto: UpdateUserPasswordDto, id: string) {
        checkIdIsValid(id)
        const user = await this.authModel.findById(id).select('+password') as any;

        // Compare passwords
        const passwordMatch = await bcrypt.compare(
            updateUserPasswordDto.oldPassword,
            user.password,
        );
        if (!passwordMatch) {
            throw new UnauthorizedException("Old Password does not match");
        }
        const updatedUser = await this.authModel.findByIdAndUpdate(
            id,
            { $set: { password: await generateHashedPassword(updateUserPasswordDto.password) } },
            { new: true, runValidators: true }
        );

        if (updatedUser === null) throw new HttpException('Invalid ID', HttpStatus.NOT_FOUND)
        return { message: 'Password updated successfully' }
    }


    async deleteUser(id: string) {
        checkIdIsValid(id)
        const updatedUser = await this.authModel.findByIdAndDelete(id);
        checkIdResponseIsValid(updatedUser)

        return { message: "User deleted successfully" }
    }
}