import { io, Socket } from 'socket.io-client';

export const socket: Socket<ServerToClientEvent, ClientToServerEvent> = io();