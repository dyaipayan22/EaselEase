'use client';

import { useRef } from 'react';
import { useBoardPosition } from '../../hooks/useBoardPosition';
import { useInterval, useMouse } from 'react-use';
import { motion } from 'framer-motion';
import { socket } from '@/lib/socket';
import { getPosition } from '@/lib/getPosition';

const MousePosition = () => {
  const prevPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const { x, y } = useBoardPosition();
  const ref = useRef<HTMLDivElement>(null);

  const { docX, docY } = useMouse(ref);

  useInterval(() => {
    if (prevPosition.current.x !== docX || prevPosition.current.y !== docY) {
      socket.emit('mouse_move', getPosition(docX, x), getPosition(docY, y));
      prevPosition.current = { x: docX, y: docY };
    }
  }, 150);

  return (
    <motion.div
      ref={ref}
      className="absolute top-0 left-0 z-50 border bg-gray-400/90 p-1 pointer-events-none"
      animate={{ x: docX + 15, y: docY + 15 }}
      transition={{ duration: 0.05, ease: 'linear' }}
    >
      {getPosition(docX, x).toFixed(0)} | {getPosition(docY, y).toFixed(0)}
    </motion.div>
  );
};

export default MousePosition;
