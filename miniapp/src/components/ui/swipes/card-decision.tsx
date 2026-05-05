import { motion, MotionValue, useTransform } from 'framer-motion';
import { Icons } from '@/assets/icons/icons';

interface CardDecisionProps {
  leftOpacity: MotionValue<number>;
  rightOpacity: MotionValue<number>;
}

const CardDecision = ({ rightOpacity, leftOpacity }: CardDecisionProps) => {
  const combined = useTransform(
    () => (rightOpacity.get() + leftOpacity.get()) / 2
  );

  return (
    <div className="absolute pointer-events-none w-full flex justify-center h-full z-20 items-center">
      <motion.div
        style={{ opacity: leftOpacity }}
        className="z-30 absolute top-1/3"
      >
        <Icons.largeHeart className="bg-white rounded-full p-4" fill="black" />
      </motion.div>
      <motion.div
        style={{ opacity: rightOpacity }}
        className="z-30 absolute top-1/3"
      >
        <Icons.cross className="bg-black rounded-full p-4" fill="fill-white" />
      </motion.div>
      <motion.div
        style={{ opacity: combined }}
        className="absolute w-full h-full bg-black z-10"
      />
    </div>
  );
};

export default CardDecision;
