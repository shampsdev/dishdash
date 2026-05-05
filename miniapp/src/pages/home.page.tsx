import { RecentLobbies } from '@/modules/recent-lobbies/recent-lobbies';

import { Header } from '@/components/ui/header';
import { useAuth } from '@/shared/hooks/useAuth';
import { CollectionCarousel } from '@/modules/collections/collection-carousel';
import { StoryTray } from '@/modules/stories/story-tray';
import { useSafeArea } from '@/shared/hooks/useSafeArea';
import { AdminTrigger } from '@/shared/util/admin-triggrer';

export const HomePage = () => {
  const { user } = useAuth();

  const { safeAreaInsets } = useSafeArea();

  return (
    <div
      style={{
        marginTop: safeAreaInsets.top > 0 ? -safeAreaInsets.top * 1.75 : 0,
        paddingTop:
          safeAreaInsets.top > 0 ? safeAreaInsets.top * 2.2 : '1.25rem'
      }}
      className="flex flex-col overflow-y-scroll h-screen no-scrollbar pb-24"
    >
      <AdminTrigger>{user && <Header user={user} />}</AdminTrigger>
      <StoryTray />
      <RecentLobbies count={1} />
      <CollectionCarousel />
    </div>
  );
};
