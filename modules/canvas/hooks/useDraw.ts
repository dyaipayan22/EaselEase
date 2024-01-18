import { useUserMoves } from '@/recoil/room';
import { useOptionsValue } from '@/recoil/options';
import { useBoardPosition } from './useBoardPosition';
import { useCallback, useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { getPosition } from '@/lib/getPosition';

let tempMoves: [number, number][] = [];

export const useDraw = (
  ctx: CanvasRenderingContext2D | undefined,
  blocked: boolean
) => {
  const { handleAddUserMove, handleRemoveUserMove } = useUserMoves();
  const options = useOptionsValue();
  const boardPosition = useBoardPosition();

  const [drawing, setDrawing] = useState<boolean>(false);
  const movedX = boardPosition.x;
  const movedY = boardPosition.y;

  useEffect(() => {
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
      if (options.erase) ctx.globalCompositeOperation = 'destination-out';
    }
  });

  useEffect(() => {
    socket.on('your_move', (move: Move) => {
      handleAddUserMove(move);
    });

    return () => {
      socket.off('your_move');
    };
  });

  const handleUndo = useCallback(() => {
    if (ctx) {
      handleRemoveUserMove();
      socket.emit('undo');
    }
  }, [ctx, handleRemoveUserMove]);

  useEffect(() => {
    const handleUndoFromKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'z' && e.ctrlKey) {
        handleUndo();
      }
    };

    document.addEventListener('keydown', handleUndoFromKeyboard);

    return () => {
      document.removeEventListener('keydown', handleUndoFromKeyboard);
    };
  }, [handleUndo]);

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked) return;

    setDrawing(true);
    ctx.beginPath();
    ctx.lineTo(getPosition(x, movedX), getPosition(y, movedY));
    ctx.stroke();

    tempMoves.push([getPosition(x, movedX), getPosition(y, movedY)]);
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    ctx.closePath();
    setDrawing(false);

    const move: Move = {
      path: tempMoves,
      options,
      timestamp: 0,
      eraser: options.erase,
    };

    tempMoves = [];
    ctx.globalCompositeOperation = 'source-over';

    socket.emit('draw', move);
  };

  const handleDraw = (x: number, y: number) => {
    if (!ctx || !drawing || blocked) {
      return;
    }
    ctx.lineTo(getPosition(x, movedX), getPosition(y, movedY));
    ctx.stroke();
    tempMoves.push([getPosition(x, movedX), getPosition(y, movedY)]);
  };

  return {
    handleStartDrawing,
    handleDraw,
    handleEndDrawing,
    handleUndo,
    drawing,
  };
};
