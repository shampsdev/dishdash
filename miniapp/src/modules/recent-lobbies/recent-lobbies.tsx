import { RecentLobbyCard } from '@/components/ui/recent-lobby-card';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../swipes/settings/settings.store';
import { useEffect, useState } from 'react';
import { fetchTags } from '@/shared/api/tags.api';
import { fetchLatestLobbies } from '@/shared/api/lobby.api';
import { Lobby } from '../swipes/interfaces/lobby.interface';
import { fetchCollections } from '@/shared/api/collections.api';
import { Collection } from '@/shared/interfaces/collection.interface';

interface RecentLobbiesProps {
  count?: number;
}

const SkeletonLoader = () => (
  <div className="h-[76px] mx-auto gap-4 p-5 px-4 flex pointer-events-auto w-full bg-secondary rounded-2xl items-center animate-pulse"></div>
);

export const RecentLobbies = ({ count }: RecentLobbiesProps) => {
  const { tags, setTags } = useSettingsStore();
  useEffect(() => {
    fetchTags().then(async (tags) => {
      if (tags != undefined) setTags(tags);
    });
  }, []);

  const [collections, setCollections] = useState<Collection[]>([]);
  useEffect(() => {
    const loadCollections = async () => {
      const data = await fetchCollections();
      if (data) setCollections(data);
    };

    loadCollections();
  }, []);

  const [lobbies, setLobbies] = useState<Lobby[] | null>(null);

  useEffect(() => {
    fetchLatestLobbies(count).then((lobbies) => {
      setLobbies(lobbies ?? []);
    });
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
    <motion.div
      className="flex flex-col gap-5 justify-end w-[92%] mx-auto mt-5"
      variants={containerVariants}
      initial="hidden"
      animate={lobbies !== null ? 'visible' : 'hidden'}
    >
      {lobbies === null
        ? Array.from({ length: count || 3 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))
        : lobbies.slice(0, count ? count : lobbies.length).map((lobby) => (
            <motion.div key={`lobby_${lobby.id}`} variants={cardVariants}>
              <RecentLobbyCard
                collections={collections}
                tags={tags}
                lobby={lobby}
              />
            </motion.div>
          ))}
    </motion.div>
  );
};
