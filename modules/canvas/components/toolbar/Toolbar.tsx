'use client';
import { useSetOptions } from '@/recoil/options/options.hooks';
import ColorPicker from './ColorPicker';
import LineWidthPicker from './LineWidthPicker';

const Toolbar = () => {
  const setOptions = useSetOptions();

  return (
    <div
      className="absolute top-[50%] left-10 flex flex-col items-center gap-5 rounded-lg p-5 bg-black text-white"
      style={{ transform: 'translateY(-50%' }}
    >
      <ColorPicker />
      <LineWidthPicker />
    </div>
  );
};

export default Toolbar;
