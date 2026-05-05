import { Icons } from '@/assets/icons/icons';
import { cn } from '@/lib/utils';

interface StoryButtonProps {
  background: string;
  title: string;
  seen: boolean;
  icon?: IconVariant;
}

export type IconVariant = 'flame' | 'people' | 'forward' | null;

const getIcon = (variant: IconVariant) => {
  const styles = 'absolute top-3 left-3';

  switch (variant) {
    case 'flame':
      return <Icons.flame className={styles} />;
    case 'people':
      return <Icons.people className={styles} />;
    case 'forward':
      return <Icons.forward className={styles} />;
  }
};

export const StoryButton = ({
  background,
  title,
  seen,
  icon = null
}: StoryButtonProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          seen ? '' : 'outline',
          'w-[100px] h-[110px] rounded-2xl relative outline-1 outline-offset-4 outline-accent-foreground overflow-hidden'
        )}
      >
        {getIcon(icon)}
        <img src={background} className="w-full h-full object-cover" />
        <h2 className="absolute bottom-3 left-3 right-3 text-left text-xs font-semibold leading-none">
          {title}
        </h2>
      </div>
    </div>
  );
};
