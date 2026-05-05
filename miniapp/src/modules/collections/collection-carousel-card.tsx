import { Icons } from '@/assets/icons/icons';
import { cn } from '@/lib/utils';

interface LargeCarouselCardProps {
  primaryText: string;
  secondaryText: string;
  src: string;
  className?: string;
  onClick: () => void;
}

export const CollectionCard = ({
  src,
  onClick,
  primaryText,
  secondaryText,
  className
}: LargeCarouselCardProps) => {
  return (
    <div className="w-[96%] mx-auto select-none">
      <div
        className={cn(
          'aspect-[3/2] bg-white overflow-hidden rounded-3xl',
          className
        )}
      >
        <img
          src={src}
          alt=""
          className="h-full w-full pointer-events-none object-cover"
        />
      </div>
      <div className="flex flex-col p-4">
        <div className="flex justify-between">
          <h1 className="font-medium text-[20px]">{primaryText}</h1>
          <div className="p-[4px]" onClick={onClick}>
            <Icons.arrowRight className="h-[20px] w-[20px] text-secondary-foreground" />
          </div>
        </div>
        <p className="text-[13px] text-secondary-foreground">{secondaryText}</p>
      </div>
    </div>
  );
};
