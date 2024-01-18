'use client';
import { CANVAS_SIZE } from '@/constants/canvasSize';
import { useViewportSize } from '@/hooks/useViewportSize';
import { useMotionValue, motion } from 'framer-motion';
import { Dispatch, SetStateAction, forwardRef, useEffect, useRef } from 'react';
import { useBoardPosition } from '../../hooks/useBoardPosition';

const Minimap = forwardRef<
  HTMLCanvasElement,
  {
    dragging: boolean;
    setMovedMinimap: Dispatch<SetStateAction<boolean>>;
  }
>(({ dragging, setMovedMinimap }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y } = useBoardPosition();
  const { width, height } = useViewportSize();

  const miniX = useMotionValue(0);
  const miniY = useMotionValue(0);

  useEffect(() => {
    miniX.on('change', (newX) => {
      if (!dragging) x.set(-newX * 7);
    });

    miniY.on('change', (newY) => {
      if (!dragging) y.set(-newY * 7);
    });

    return () => {
      miniX.clearListeners();
      miniY.clearListeners();
    };
  }, [dragging, miniX, miniY, x, y]);

  return (
    <div
      className="absolute right-10 top-10 z-30 bg-zinc-50 rounded-lg overflow-hidden"
      ref={containerRef}
      style={{ width: CANVAS_SIZE.width / 7, height: CANVAS_SIZE.height / 7 }}
    >
      <canvas
        ref={ref}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className="w-full h-full"
      />

      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onDragStart={() => setMovedMinimap((prev: boolean) => !prev)}
        onDragEnd={() => setMovedMinimap((prev: boolean) => !prev)}
        className="absolute top-0 left-0 cursor-grab border-2 border-red-500 rounded-lg"
        style={{
          width: width / 7,
          height: height / 7,
          x: miniX,
          y: miniY,
        }}
        animate={{ x: -x.get() / 7, y: -y.get() / 7 }}
        transition={{ duration: 0 }}
      ></motion.div>
    </div>
  );
});

Minimap.displayName = 'Minimap';
export default Minimap;
