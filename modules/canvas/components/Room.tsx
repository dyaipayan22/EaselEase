'use client';
import { useRouter } from 'next/navigation';
import { useRoom, useSetRoomId } from '@/recoil/room';
import RoomContextProvider from '../context/room.context';
import Canvas from './Canvas';
import MousePosition from './MousePosition';
import MouseRenderer from './MouseRenderer';
import NameInput from './NameInput';

const Room = () => {
  const room = useRoom();
  if (!room.id) return <NameInput />;
  return (
    <RoomContextProvider>
      <div className="relative h-full w-full overflow-hidden">
        <Canvas />
        <MousePosition />
        <MouseRenderer />
      </div>
    </RoomContextProvider>
  );
};

export default Room;
