import { PlaceCarousel } from '@/modules/places/place-carousel';
import { useSaved } from '@/shared/hooks/useSaved';
import { viewport } from '@telegram-apps/sdk-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const SavedPage = () => {
  const safeAreaInsets = viewport.safeAreaInsets();
  const { saved } = useSaved();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: [0.25, 0.8, 0.5, 1] }
    }
  };

  return (
    <motion.div
      style={{
        marginTop: safeAreaInsets.top > 0 ? -safeAreaInsets.top * 1.75 : 0,
        paddingTop:
          safeAreaInsets.top > 0 ? safeAreaInsets.top * 2.2 : '1.25rem'
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col overflow-y-auto h-screen no-scrollbar pb-24"
    >
      <div className="flex w-[92%] mx-auto justify-between items-center">
        <h1 className="text-2xl font-medium">Избранное</h1>
      </div>
      {saved?.places.flatMap((x) => (
        <motion.div key={`place_${x.id}_carousel`} variants={cardVariants}>
          <PlaceCarousel onClick={() => navigate(`/card/${x.id}`)} place={x} />
        </motion.div>
      ))}
    </motion.div>
  );
};
