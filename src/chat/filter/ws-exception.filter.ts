import { ArgumentsHost, Catch, HttpException, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';


@Catch()
export class WebsocketExceptionFilter implements WsExceptionFilter {
    catch(_exception: any, host: ArgumentsHost) {
        const socket = host.switchToWs().getClient();
        let message = 'Message is invalid';

        if (_exception instanceof WsException) {
            const error = _exception.getError();
            message = typeof error === 'string' ? error : (error as any)?.message ?? message;
        }

        else if (_exception instanceof HttpException) {
            const response = _exception.getResponse();
            if (
                typeof response === 'object' && response !== null && 'message' in response
            ) {
                message = Array.isArray((response as any).message)
                    ? (response as any).message.join(', ')
                    : (response as any).message;
            }
        }

        socket.emit('exception', {
            status: 'error',
            message: message,
        });
    }
}