import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Roles, RolesType } from "src/constant/role";
import { UserSettings } from "src/user-settings/userSettings.schema";

@Schema()

export class Auth {

  @Prop({ required: false })
  displayName: string

  @Prop({ unique: true })
  email: string

  @Prop({ required: false })
  phoneNumber?: string

  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: Roles.USER })
  role: RolesType

  @Prop({ required: true, select: false })
  password: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "UserSettings" })
  settings: UserSettings
}

export class SignInAuth {

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password?: string
}

@Schema({ timestamps: true })
export class Verification {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  codeHash: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  used: boolean;
}

@Schema({ timestamps: true })
export class VerificationEmail {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  codeHash: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  used: boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
export const VerificationSchema = SchemaFactory.createForClass(Verification);
export const VerificationEmailSchema = SchemaFactory.createForClass(VerificationEmail);
export const AuthSignInSchema = SchemaFactory.createForClass(SignInAuth);