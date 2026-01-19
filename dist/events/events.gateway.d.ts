import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    emitProgressUpdate(parentId: string, data: any): void;
    joinRoom(client: Socket, parentId: string): void;
    handleMessage(client: any, payload: any): string;
}
