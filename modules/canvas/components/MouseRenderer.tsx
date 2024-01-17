'use client';

import { useRoom } from '@/recoil/room';
import UserMouse from './UserMouse';
import { socket } from '@/lib/socket';

const MouseRenderer = () => {
  const room = useRoom();
  return (
    <>
      {[...room.users.keys()].map((userId) => {
        if (userId === socket.id) return null;
        return (
          <UserMouse
            userId={userId}
            key={userId}
            username={room.users.get(userId) || 'Anonymous'}
          />
        );
      })}
    </>
  );
};

export default MouseRenderer;
