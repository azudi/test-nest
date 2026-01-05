import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()

export class UserSettings {

    @Prop({ default: true })
    emailNotification: boolean;

    @Prop({ default: false })
    pushNotification: boolean;

    @Prop({ default: false })
    smsNotofication: boolean;
}


export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);