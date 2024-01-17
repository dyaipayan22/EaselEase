'use client';

import { CANVAS_SIZE } from '@/constants/canvasSize';
import { useViewportSize } from '@/hooks/useViewportSize';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useKeyPressEvent } from 'react-use';
import Minimap from './Minimap';
import { useBoardPosition } from '../hooks/useBoardPosition';
import Toolbar from './toolbar/Toolbar';
import { useRoom } from '@/recoil/room';
import { socket } from '@/lib/socket';
import { drawAllMoves } from '../helpers/canvas.helpers';

import { useSocketDraw } from '../hooks/useSocketDraw';
import { useDraw } from '../hooks/useDraw';

const Canvas = () => {
  const room = useRoom();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [dragging, setDragging] = useState(false);
  const [, setMovedMinimap] = useState(false);

  const { width, height } = useViewportSize();

  useKeyPressEvent('Control', (e) => {
    if (e.ctrlKey && !dragging) {
      setDragging(true);
    }
  });

  const { x, y } = useBoardPosition();

  const renderCanvasToMinimap = () => {
    if (canvasRef.current && minimapRef.current) {
      const minimapCtx = minimapRef.current.getContext('2d');
      if (minimapCtx) {
        minimapCtx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
        minimapCtx.drawImage(
          canvasRef.current,
          0,
          0,
          CANVAS_SIZE.width,
          CANVAS_SIZE.height
        );
      }
    }
  };

  const {
    handleStartDrawing,
    handleDraw,
    handleEndDrawing,
    handleUndo,
    drawing,
  } = useDraw(ctx, dragging);

  useSocketDraw(ctx, drawing);

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext('2d');
    if (newCtx) setCtx(newCtx);

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && dragging) {
        setDragging(false);
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [dragging]);

  useEffect(() => {
    if (ctx) socket.emit('joined_room');
  }, [ctx]);

  useEffect(() => {
    if (ctx) {
      drawAllMoves(ctx, room);
      renderCanvasToMinimap();
    }
  }, [ctx, room]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Toolbar />
      <button onClick={handleUndo} className="absolute top-0">
        Undo
      </button>
      <motion.canvas
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className={`bg-zinc-100 ${dragging && 'cursor-move'}`}
        style={{ x, y }}
        drag={dragging}
        dragConstraints={{
          left: -(CANVAS_SIZE.width - width),
          right: 0,
          top: -(CANVAS_SIZE.height - height),
          bottom: 0,
        }}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onMouseDown={(e) => handleStartDrawing(e.clientX, e.clientY)}
        onMouseUp={handleEndDrawing}
        onMouseMove={(e) => {
          handleDraw(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          handleStartDrawing(
            e.changedTouches[0].clientX,
            e.changedTouches[0].clientY
          );
        }}
        onTouchEnd={handleEndDrawing}
        onTouchMove={(e) =>
          handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
        }
      />
      <Minimap
        ref={minimapRef}
        dragging={dragging}
        setMovedMinimap={setMovedMinimap}
      />
    </div>
  );
};

export default Canvas;
