import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false })

export class ChatMessage {

    @Prop()
    senderId: string;

    @Prop()
    receiverId: string;

    @Prop({ required: true })
    content: string;

    @Prop({ default: false })
    read: boolean;

    @Prop({ default: new Date() })
    createdAt: string;

    @Prop({ default: new Date() })
    updatedAt: string;
}


export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);