import { Icons } from '@/assets/icons/icons';
import { Tag } from '@/components/ui/tag';
import { Collection } from '@/shared/interfaces/collection.interface';

interface CollectionHeaderProps {
  collection: Collection;
}

export const CollectionHeader = ({ collection }: CollectionHeaderProps) => {
  const getPlaceWordForm = (count: number): string => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) {
      return 'место';
    }
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return 'места';
    }
    return 'мест';
  };

  return (
    <>
      <div className="relative h-[60vh]">
        <div className="h-full">
          <img src={collection.avatar} className="h-full w-full object-cover" />
        </div>
        <div className="absolute mx-[4%] bottom-0 z-20">
          <h1 className="text-2xl font-medium">{collection.name}</h1>
          <p className="text-sm font-medium text-secondary-foreground">
            {collection.description}
          </p>
        </div>
        <div className="absolute pointer-events-none bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black to-transparent z-10" />
      </div>
      <div className="w-[92%] py-4 mx-auto flex gap-2">
        <Tag
          icon={<Icons.cards />}
          text={`${collection.places.length} ${getPlaceWordForm(collection.places.length)}`}
        />
      </div>
    </>
  );
};
