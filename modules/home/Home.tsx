'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { socket } from '@/lib/socket';
import { useSetRoomId } from '@/recoil/room';

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const setAtomRoomId = useSetRoomId();

  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    socket.on('created', (roomIdFromServer) => {
      setAtomRoomId(roomIdFromServer);
      router.push(roomIdFromServer);
    });

    const handleJoinedRoom = (roomIdFromServer: string, failed?: boolean) => {
      if (!failed) {
        setAtomRoomId(roomIdFromServer);
        router.push(roomIdFromServer);
      } else console.log('Failed to join room');
    };

    socket.on('joined', handleJoinedRoom);

    return () => {
      socket.off('created');
      socket.off('joined', handleJoinedRoom);
    };
  }, [router, setAtomRoomId]);

  const handleCreateRoom = () => {
    socket.emit('create_room', username);
  };

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('join_room', roomId, username);
  };

  if (!isClient) return null;
  return (
    <div className="flex flex-col items-center">
      <h1 className="mt-24 font-extrabold text-extra leading-tight">
        Digiboard
      </h1>
      <h3 className="text-2xl">Real time whiteboard</h3>

      <div className="mt-10 flex flex-col gap-2">
        <label className="self-start font-bold leading-tight">
          Enter your name
        </label>
        <input
          className="rounded-xl border p-5 py-1"
          id="room-id"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <form
        onSubmit={handleJoinRoom}
        className="flex flex-col items-center gap-3"
      >
        <label htmlFor="room-id" className="self-start leading-tight font-bold">
          Enter Room ID
        </label>
        <input
          type="text"
          className="rounded-xl border p-5 pt-1"
          id="room-id"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <button
          type="submit"
          className="rounded-xl bg-black p-5 py-1 text-white transition-all"
        >
          Join
        </button>
      </form>

      <div className="mt-8 flex flex-col items-center gap-2">
        <h5 className="self-start font-bold leading-tight">Create new room</h5>
        <button
          onClick={handleCreateRoom}
          className="rounded-xl bg-black p-5 py-1 text-white transition-all"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default Home;
