import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { DEFAULT_ROOM, roomAtom } from './room.atom';
import { getNextColor } from '@/lib/getNextColor';

export const useRoomId = () => {
  const { id } = useRecoilValue(roomAtom);

  return id;
};

export const useRoom = () => {
  const room = useRecoilValue(roomAtom);

  return room;
};

export const useSetRoomId = () => {
  const setRoomId = useSetRecoilState(roomAtom);

  const handleSetRoomId = (id: string) => {
    setRoomId({ ...DEFAULT_ROOM, id });
  };

  return handleSetRoomId;
};

export const useSetRoom = () => {
  const setRoom = useSetRecoilState(roomAtom);

  return setRoom;
};

export const useSetUsers = () => {
  const setRoom = useSetRecoilState(roomAtom);

  const handleAddUser = (userId: string, name: string) => {
    setRoom((prev) => {
      const newUsers = prev.users;
      const newUsersMoves = prev.usersMoves;

      const color = getNextColor([...newUsers.values()].pop()?.color);

      newUsers.set(userId, {
        name,
        color,
      });
      newUsersMoves.set(userId, []);
      return { ...prev, users: newUsers, usersMoves: newUsersMoves };
    });
  };

  const handleRemoveUser = (userId: string) => {
    setRoom((prev) => {
      const newUsers = prev.users;
      const newUsersMoves = prev.usersMoves;
      const userMoves = newUsersMoves.get(userId);
      newUsers.delete(userId);
      newUsersMoves.delete(userId);

      return {
        ...prev,
        users: newUsers,
        usersMoves: newUsersMoves,
        movesWithoutUser: [...prev.movesWithoutUser, ...(userMoves || [])],
      };
    });
  };

  const handleAddMoveToUser = (userId: string, moves: Move) => {
    setRoom((prev) => {
      const newUsersMoves = prev.usersMoves;
      const oldMoves = prev.usersMoves.get(userId);

      newUsersMoves.set(userId, [...(oldMoves || []), moves]);
      return { ...prev, usersMoves: newUsersMoves };
    });
  };

  const handleRemoveMoveFromUser = (userId: string) => {
    setRoom((prev) => {
      const newUsersMoves = prev.usersMoves;
      const oldMoves = prev.usersMoves.get(userId);
      oldMoves?.pop();

      newUsersMoves.set(userId, oldMoves || []);
      return { ...prev, usersMoves: newUsersMoves };
    });
  };

  return {
    handleAddUser,
    handleRemoveUser,
    handleAddMoveToUser,
    handleRemoveMoveFromUser,
  };
};

export const useUserMoves = () => {
  const [room, setRoom] = useRecoilState(roomAtom);

  const handleAddUserMove = (move: Move) => {
    setRoom((prev) => ({ ...prev, userMoves: [...prev.userMoves, move] }));
  };

  const handleRemoveUserMove = () => {
    const newMoves = [...room.userMoves];
    newMoves.pop();
    setRoom((prev) => ({ ...prev, userMoves: newMoves }));
  };

  return { handleAddUserMove, handleRemoveUserMove, userMoves: room.userMoves };
};
