import { MotionValue } from 'framer-motion';

export const getPosition = (position: number, motionValue: MotionValue) =>
  position - motionValue.get();
