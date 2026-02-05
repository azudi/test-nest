import { Injectable } from "@nestjs/common";
import { ChatMessage } from "./chat.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {IncomingMessageDto} from "./dto/incoming-message.dto"


@Injectable()
export class ChatService {
    constructor(
        @InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessage>
    ) { }

    async create(IncomingMessageDto: IncomingMessageDto) {
        const message = new this.chatMessageModel(IncomingMessageDto);
        return await message.save();
    }
}