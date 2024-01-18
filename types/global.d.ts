export declare global {
  interface CtxOptions {
    lineWidth: number;
    lineColor: string;
    erase: boolean;
  }

  interface Move {
    path: [number, number][];
    options: CtxOptions;
    timestamp: number;
    eraser: boolean;
  }

  interface Message {
    userId: string;
    username: string;
    color: string;
    message: string;
    id: number;
  }

  interface ServerToClientEvent {
    your_move: (move: Move) => void;
    new_message: (userId: string, message: string) => void;
    room_exists: (exists: boolean) => void;
    room: (room: Room, usersMovesToParse: string, usersToParse: string) => void;
    created: (roomId: string) => void;
    joined: (roomId: string, failed?: boolean) => void;
    user_draw: (move: Move, userId: string) => void;
    mouse_moved: (x: number, y: number, userId: string) => void;
    user_undo(userId: string): void;
    new_user: (userId: string, username: string) => void;
    user_disconnected: (userId: string) => void;
  }

  interface ClientToServerEvent {
    check_room: (roomId: string) => void;
    draw: (moves: Move) => void;
    mouse_move: (x: number, y: number) => void;
    undo: () => void;
    create_room: (username: string) => void;
    join_room: (room: string, username: string) => void;
    joined_room: () => void;
    leave_room: () => void;
    send_message: (message: string) => void;
  }

  type Room = {
    usersMoves: Map<string, Move[]>;
    drawed: Move[];
    users: Map<string, string>;
  };

  interface ClientRoom {
    id: string;
    usersMoves: Map<string, Move[]>;
    movesWithoutUser: Move[];
    userMoves: Move[];
    users: Map<string, User>;
  }

  interface User {
    name: string;
    color: string;
  }
}
