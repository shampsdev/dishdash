import { RecentLobbies } from '@/modules/recent-lobbies/recent-lobbies';
import { viewport } from '@telegram-apps/sdk-react';

export const HistoryPage = () => {
  const safeAreaInsets = viewport.safeAreaInsets();

  return (
    <div
      style={{
        marginTop: safeAreaInsets.top > 0 ? -safeAreaInsets.top * 1.75 : 0,
        paddingTop:
          safeAreaInsets.top > 0 ? safeAreaInsets.top * 2.2 : '1.25rem'
      }}
      className="flex flex-col overflow-y-scroll h-screen no-scrollbar pb-24"
    >
      <div className="mx-auto w-[92%]">
        <h1 className="text-2xl font-medium">История</h1>
      </div>
      <RecentLobbies />
    </div>
  );
};
