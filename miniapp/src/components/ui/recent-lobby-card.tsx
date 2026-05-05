import { useNavigate } from 'react-router-dom';
import { Tag } from '@/shared/interfaces/tag.interface';
import { Lobby } from '@/modules/swipes/interfaces/lobby.interface';
import { AvatarStack } from '@/components/ui/avatar-stack';
import {
  isClassicPlaces,
  isCollectionPlaces
} from '@/modules/swipes/interfaces/settings/settings.interface';
import { Collection } from '@/shared/interfaces/collection.interface';

interface LobbyCardProps {
  lobby: Lobby;
  tags: Tag[];
  collections: Collection[];
}

export const RecentLobbyCard = ({
  lobby,
  tags,
  collections
}: LobbyCardProps) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/${lobby.id}/${lobby.state === 'lobby' ? 'lobby' : 'results'}`);
  };

  const getDiff = (time: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - time.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    const pluralize = (
      value: number,
      words: [string, string, string]
    ): string => {
      if (value % 10 === 1 && value % 100 !== 11) return words[0];
      if (
        value % 10 >= 2 &&
        value % 10 <= 4 &&
        (value % 100 < 10 || value % 100 >= 20)
      )
        return words[1];
      return words[2];
    };

    if (years > 0)
      return `${years} ${pluralize(years, ['год', 'года', 'лет'])} назад`;
    if (months > 0)
      return `${months} ${pluralize(months, ['месяц', 'месяца', 'месяцев'])} назад`;
    if (weeks > 0)
      return `${weeks} ${pluralize(weeks, ['неделя', 'недели', 'недель'])} назад`;
    if (days > 0)
      return `${days} ${pluralize(days, ['день', 'дня', 'дней'])} назад`;
    if (hours > 0)
      return `${hours} ${pluralize(hours, ['час', 'часа', 'часов'])} назад`;
    if (minutes > 0)
      return `${minutes} ${pluralize(minutes, ['минута', 'минуты', 'минут'])} назад`;
    if (seconds > 0)
      return `${seconds} ${pluralize(seconds, ['секунда', 'секунды', 'секунд'])} назад`;

    return 'только что';
  };

  const getLobbyCategories = (tagIds: number[]) => {
    return tags.length > 0
      ? tags
          .filter((x) => tagIds.includes(x.id))
          .slice(0, 3)
          .flatMap((x) => x.name)
          .join(' · ')
      : 'Без тегов';
  };

  const getCollectionName = (collectionId: string) => {
    return collections.find((x) => x.id == collectionId)?.name;
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer h-[76px] mx-auto gap-4 p-5 px-4 flex pointer-events-auto w-full bg-secondary rounded-2xl items-center"
    >
      <div className="w-full flex flex-col justify-center">
        <div className="line-clamp-1">
          {isCollectionPlaces(lobby.settings) && (
            <p className="text-secondary-foreground font-medium">
              {getCollectionName(lobby.settings.collectionPlaces.collectionId)}
            </p>
          )}
          {isClassicPlaces(lobby.settings) && (
            <p className="text-secondary-foreground font-medium">
              {getLobbyCategories(lobby.settings.classicPlaces.tags)}
            </p>
          )}
        </div>
        <span className="text-xl font-medium">
          {getDiff(new Date(lobby?.createdAt ?? ''))}
        </span>
      </div>
      <div className="flex gap-2 flex-shrink-0 items-center h-full">
        <AvatarStack
          avatars={lobby.users.map((x) => ({
            src: x.avatar
          }))}
        />
      </div>
    </div>
  );
};
