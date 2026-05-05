import { useQuery } from '@tanstack/react-query';
import { fetchStoryCollections } from '../api/stories.api';
import { cloudStorage } from '@telegram-apps/sdk-react';
import { useEffect, useState, useRef } from 'react';

export const useStories = () => {
  const [seen, setSeen] = useState<string[]>([]);
  const hasLoaded = useRef(false);

  useEffect(() => {
    const loadSeen = async () => {
      try {
        // @ts-expect-error this is just broken sdk
        const { seen } = await cloudStorage.getItem('seen');
        if (seen) {
          setSeen(JSON.parse(seen));
        }
      } catch (error) {
        console.error('Failed to load seen stories:', error);
      } finally {
        hasLoaded.current = true;
      }
    };

    loadSeen();
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    cloudStorage.setItem('seen', JSON.stringify(seen));
  }, [seen]);

  const { data: stories } = useQuery({
    queryKey: ['stories'],
    queryFn: fetchStoryCollections
  });

  const addToSeen = (id: string) => {
    setSeen((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return {
    stories,
    seen,
    addToSeen
  };
};
