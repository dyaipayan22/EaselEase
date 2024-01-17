import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useSetUsers } from '@/recoil/room';

export const useSocketDraw = (
  ctx: CanvasRenderingContext2D | undefined,
  drawing: boolean
) => {
  const { handleAddMoveToUser, handleRemoveMoveFromUser } = useSetUsers();

  useEffect(() => {
    let movesToDrawLater: Move | undefined;
    let userToDraw = '';
    socket.on('user_draw', (move, userId) => {
      if (ctx && !drawing) {
        handleAddMoveToUser(userId, move);
      } else {
        movesToDrawLater = move;
        userToDraw = userId;
      }
    });

    return () => {
      socket.off('user_draw');

      if (movesToDrawLater && userToDraw && ctx) {
        handleAddMoveToUser(userToDraw, movesToDrawLater);
      }
    };
  }, [ctx, handleAddMoveToUser, drawing]);

  useEffect(() => {
    socket.on('user_undo', (userId) => {
      handleRemoveMoveFromUser(userId);
    });

    return () => {
      socket.off('user_undo');
    };
  }, [ctx, handleRemoveMoveFromUser]);
};
