'use client';
import { useState, useEffect } from 'react';
import { useBoardPosition } from '../../hooks/useBoardPosition';
import { motion } from 'framer-motion';
import { socket } from '@/lib/socket';

import { BsCursorFill } from 'react-icons/bs';
import { useRoom } from '@/recoil/room';

const UserMouse = ({ userId }: { userId: string }) => {
  const { users } = useRoom();
  const boardPosition = useBoardPosition();
  const [msg, setMsg] = useState('');
  const [x, setX] = useState(boardPosition.x.get());
  const [y, setY] = useState(boardPosition.y.get());

  const [position, setPosition] = useState({ x: -1, y: -1 });

  useEffect(() => {
    socket.on('mouse_moved', (newX, newY, socketIdMoved) => {
      if (socketIdMoved === userId) {
        setPosition({ x: newX, y: newY });
      }
    });

    const handleNewMsg = (msgUserId: string, newMsg: string) => {
      if (msgUserId === userId) {
        setMsg(newMsg);

        setTimeout(() => {
          setMsg('');
        }, 3000);
      }
    };

    socket.on('new_message', handleNewMsg);

    return () => {
      socket.off('mouse_moved');
      socket.off('new_message', handleNewMsg);
    };
  }, [userId]);

  useEffect(() => {
    const unsubscribe = boardPosition.x.on('change', setX);
    return unsubscribe;
  }, [boardPosition.x]);

  useEffect(() => {
    const unsubscribe = boardPosition.y.on('change', setY);
    return unsubscribe;
  }, [boardPosition.y]);

  return (
    <motion.div
      className={`absolute top-0 left-0 text-blue-600 pointer-events-none ${
        position.x === -1 && 'hidden'
      }`}
      style={{ color: users.get(userId)?.color }}
      animate={{ x: position.x + x, y: position.y + y }}
      transition={{ duration: 0.2, ease: 'linear' }}
    >
      <BsCursorFill className="-rotate-90" />
      {msg && (
        <p className="absolute top-full left-5 max-w-[15rem] overflow-hidden text-ellipsis rounded-md bg-zinc-900 p-1 px-3 text-white">
          {msg}
        </p>
      )}
      <p className="ml-2">{users.get(userId)?.name || 'Anonymous'}</p>
    </motion.div>
  );
};

export default UserMouse;
