export declare global {
  interface CtxOptions {
    lineWidth: number;
    lineColor: string;
  }

  interface Move {
    path: [number, number][];
    options: CtxOptions;
  }

  interface ServerToClientEvent {
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
    users: Map<string, string>;
  }
}