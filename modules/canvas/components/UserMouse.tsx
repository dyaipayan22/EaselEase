import { useState, useEffect } from 'react';
import { useBoardPosition } from '../hooks/useBoardPosition';
import { motion } from 'framer-motion';
import { socket } from '@/lib/socket';

import { BsCursorFill } from 'react-icons/bs';

const UserMouse = ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) => {
  const boardPosition = useBoardPosition();
  const [x, setX] = useState(boardPosition.x.get());
  const [y, setY] = useState(boardPosition.y.get());

  const [position, setPosition] = useState({ x: -1, y: -1 });

  useEffect(() => {
    socket.on('mouse_moved', (newX, newY, socketIdMoved) => {
      if (socketIdMoved === userId) {
        setPosition({ x: newX, y: newY });
      }
    });

    return () => {
      socket.off('mouse_moved');
    };
  }, [userId]);

  useEffect(() => {
    const unsubscribe = boardPosition.x.onChange(setX);
    return unsubscribe;
  }, [boardPosition.x]);

  useEffect(() => {
    const unsubscribe = boardPosition.y.onChange(setY);
    return unsubscribe;
  }, [boardPosition.y]);

  return (
    <motion.div
      className={`absolute top-0 left-0 text-blue-600 pointer-events-none ${
        position.x === -1 && 'hidden'
      }`}
      animate={{ x: position.x + x, y: position.y + y }}
      transition={{ duration: 0.1, ease: 'linear' }}
    >
      <BsCursorFill className="-rotate-90" />
      <p className="ml-2">{username}</p>
    </motion.div>
  );
};

export default UserMouse;
