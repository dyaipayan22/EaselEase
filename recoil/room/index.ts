import { roomAtom } from './room.atom';
import {
  useRoomId,
  useSetRoomId,
  useRoom,
  useSetUsers,
  useUserMoves,
} from './room.hooks';

export default roomAtom;

export { useRoomId, useSetRoomId, useRoom, useUserMoves, useSetUsers };
