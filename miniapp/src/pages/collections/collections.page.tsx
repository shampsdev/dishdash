import { CollectionCard } from '@/modules/collections/collection-carousel-card';
import { fetchCollections } from '@/shared/api/collections.api';
import { Collection } from '@/shared/interfaces/collection.interface';
import { viewport } from '@telegram-apps/sdk-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CollectionsPage = () => {
  const safeAreaInsets = viewport.safeAreaInsets();
  const navigate = useNavigate();

  const [collections, setCollections] = useState<Collection[]>([]);
  useEffect(() => {
    const loadCollections = async () => {
      const data = await fetchCollections();
      if (data) setCollections(data);
    };

    loadCollections();
  }, []);

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
    <div
      style={{
        marginTop: safeAreaInsets.top > 0 ? -safeAreaInsets.top * 1.75 : 0,
        paddingTop:
          safeAreaInsets.top > 0 ? safeAreaInsets.top * 2.2 : '1.25rem'
      }}
      className="flex flex-col overflow-y-scroll h-screen no-scrollbar pb-24"
    >
      <div className="mx-auto w-[92%] pb-5">
        <h1 className="text-2xl font-medium">Подборки</h1>
      </div>
      {collections.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 w-[92%] mx-auto"
        >
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              variants={cardVariants}
            >
              <CollectionCard
                className="aspect-video"
                primaryText={collection.name}
                secondaryText={collection.description}
                onClick={() => navigate(`/collections/${collection.id}`)}
                src={collection.avatar}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
