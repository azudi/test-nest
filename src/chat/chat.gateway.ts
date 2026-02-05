import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { IncomingMessageDto } from './dto/incoming-message.dto';
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebsocketExceptionFilter } from './filter/ws-exception.filter';
import { Socket, Server } from 'socket.io';
import { JwtService } from "@nestjs/jwt";
import { ChatService } from './chat.service';
// import { WsJwtGuard } from './guard/jwt-web.guard';


@WebSocketGateway(
  {
    cors: {
      origin: "*"
    }
  }
)
// @UseGuards(WsJwtGuard)
@UseFilters(new WebsocketExceptionFilter())
export class ChatGateway {
  constructor(
    private readonly JwtService: JwtService,
    private messageService: ChatService
  ) { }

  @WebSocketServer()
  server: Server;


  @SubscribeMessage('message')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )


  async handleMessage(@MessageBody() message: IncomingMessageDto) {
    const savedMsg = await this.messageService.create(message)
    this.server.emit('message', {...savedMsg});
    return {"data-base-response": savedMsg}
  }


  handleConnection(client: Socket) {
    try {
      const token = client.handshake?.auth?.token;

      // <---- uncomment thsi code if u want to disconnect when not token --->
      // if (!token) {
      //   client.disconnect();
      //   return;
      // }

      const payload = this.JwtService.verify(token);

      client = payload?.sub;

      console.log('User connected:', client?.data?.userId);
    } catch (err) {
      // client.disconnect();
      console.log('❌❌ User disconnected:');
    }
  }
}
