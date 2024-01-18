'use client';

import ColorPicker from './ColorPicker';
import LineWidthPicker from './LineWidthPicker';
import Eraser from './Eraser';
import { RefObject } from 'react';
import { FaUndo } from 'react-icons/fa';

const Toolbar = ({ undoRef }: { undoRef: RefObject<HTMLButtonElement> }) => {
  return (
    <div
      className="absolute top-[50%] left-10 flex flex-col items-center gap-5 rounded-lg p-5 bg-zinc-900 text-white"
      style={{ transform: 'translateY(-50%' }}
    >
      <button className="text-xl" ref={undoRef}>
        <FaUndo />
      </button>
      <div className="h-px w-full bg-white" />
      <ColorPicker />
      <LineWidthPicker />
      <Eraser />
    </div>
  );
};

export default Toolbar;
