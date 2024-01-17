'use client';
import { useOptions } from '@/recoil/options';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useClickAway } from 'react-use';

const ColorPicker = () => {
  const [options, setOptions] = useOptions();
  const [opened, setOpened] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, () => setOpened(false));
  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        className="h-6 w-6 rounded-full border-2 border-white transition-all hover:scale-125 active:scale-100"
        style={{ backgroundColor: options.lineColor }}
        onClick={() => setOpened(!opened)}
      >
        <AnimatePresence>
          {opened && (
            <motion.div
              className="absolute top-0 left-14"
              variants={ColorPickerAnimation}
              initial="from"
              animate="to"
              exit="from"
            >
              <HexColorPicker
                color={options.lineColor}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, lineColor: e }))
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default ColorPicker;
