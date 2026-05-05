import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { backButton, viewport } from '@telegram-apps/sdk-react';

import { CollectionHeader } from '@/modules/collections/collection-header';
import { CollectionMainButton } from '@/modules/collections/collection-main-button';
import { PlaceCarousel } from '@/modules/places/place-carousel';
import { Collection } from '@/shared/interfaces/collection.interface';
import { fetchCollection } from '@/shared/api/collections.api';
import { motion } from 'framer-motion';

export const CollectionPage = () => {
  const safeAreaInsets = viewport.safeAreaInsets();
  const navigate = useNavigate();
  const { id } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const loadCollection = async () => {
      if (!id) return;
      const data = await fetchCollection(id);
      if (data) setCollection(data);
    };

    loadCollection();
  }, [id]);

  useEffect(() => {
    if (!backButton.isMounted() || !backButton.isSupported()) return;

    backButton.show();
    backButton.onClick(goBack);

    return () => {
      backButton.hide();
      backButton.offClick(goBack);
    };
  }, []);

  const onSwipe = () => {
    if (!collection) return;
    navigate(`/map/${collection.id}`);
  };

  if (!collection) return null;

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
        marginTop: safeAreaInsets.top > 0 ? -safeAreaInsets.top * 1.75 : 0
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col overflow-y-scroll h-screen no-scrollbar pb-24"
    >
      <CollectionHeader collection={collection} />

      {collection.places.map((place) => (
        <motion.div key={`place_${place.id}_carousel`} variants={cardVariants}>
          <PlaceCarousel
            onClick={() => navigate(`/card/${place.id}`)}
            place={place}
          />
        </motion.div>
      ))}

      <CollectionMainButton onClick={onSwipe} />
    </motion.div>
  );
};
