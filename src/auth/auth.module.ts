import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Auth, AuthSchema, SignInAuth, AuthSignInSchema, Verification, VerificationSchema, VerificationEmail, VerificationEmailSchema } from "./auth.schema";
import { UserSettings, UserSettingsSchema } from "src/user-settings/userSettings.schema";
import { JwtAuthModule } from "src/shared/jwt-auth.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { MailModule } from "src/mail/mail.module";

@Module({
    imports: [
        JwtAuthModule,
        MailModule,
        MongooseModule.forFeature([
            {
                name: Auth.name,
                schema: AuthSchema
            },
            {
                name: SignInAuth.name,
                schema: AuthSignInSchema
            },
            {
                name: UserSettings.name,
                schema: UserSettingsSchema
            },
            {
                name: Verification.name,
                schema: VerificationSchema
            },
            {
                name: VerificationEmail.name,
                schema: VerificationEmailSchema
            }
        ])
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})

export class AuthModule { }