import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { JwtAuthModule } from "src/shared/jwt-auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatMessage, ChatMessageSchema } from "./chat.schema";
import { ChatService } from "./chat.service";

@Module({
    imports: [
        JwtAuthModule,
        MongooseModule.forFeature([
            {
                name: ChatMessage.name,
                schema: ChatMessageSchema
            }
        ])
    ],
    providers: [ChatGateway, ChatService],
    exports: [ChatService]
})

export class ChatModule { }