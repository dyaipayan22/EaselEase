'use client';
import { useRoom } from '@/recoil/room';
import RoomContextProvider from '../context/room.context';
import Canvas from './board/Canvas';
import MousePosition from './board/MousePosition';
import MouseRenderer from './board/MouseRenderer';
import NameInput from './NameInput';
import UserList from './UserList';
import { useRef } from 'react';
import Toolbar from './toolbar/Toolbar';
import Chat from './chat/Chat';

const Room = () => {
  const room = useRoom();
  const undoRef = useRef<HTMLButtonElement>(null);
  if (!room.id) return <NameInput />;
  return (
    <RoomContextProvider>
      <div className="relative h-full w-full overflow-hidden">
        <UserList />
        <Toolbar undoRef={undoRef} />
        <Canvas undoRef={undoRef} />
        <MousePosition />
        <MouseRenderer />
        <Chat />
      </div>
    </RoomContextProvider>
  );
};

export default Room;
