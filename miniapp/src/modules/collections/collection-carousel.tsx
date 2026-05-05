import { useEffect, useState } from 'react';

import { Carousel } from '@/components/ui/carousel/carousel';
import { CollectionCard } from '@/modules/collections/collection-carousel-card';

import { fetchCollections } from '@/shared/api/collections.api';
import { Collection } from '@/shared/interfaces/collection.interface';

import { useNavigate } from 'react-router-dom';

export const CollectionCarousel = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const loadCollections = async () => {
      const data = await fetchCollections();
      if (data) setCollections(data);
    };

    loadCollections();
  }, []);


  return (
    <div className="pt-4">
      <h1 className="w-[92%] mx-auto text-2xl font-medium">Подборки</h1>

      {collections.length > 0 && (
        <Carousel className="pt-4 mx-[4%]">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              primaryText={collection.name}
              secondaryText={collection.description}
              src={collection.avatar}
              onClick={() => navigate(`/collections/${collection.id}`)}
            />
          ))}
        </Carousel>
      )}
    </div>
  );
};
