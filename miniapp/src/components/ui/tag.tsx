import { cn } from '@/lib/utils';

interface TagProps {
  text?: string;
  icon?: JSX.Element;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeVariants = {
  sm: 'text-xs font-medium px-[14px] py-[6px]',
  md: 'text-sm px-3 py-2',
  lg: 'text-base px-4 py-2.5'
};

export const Tag = ({ text, icon, className, size = 'md' }: TagProps) => {
  return (
    <div
      className={cn(
        'bg-secondary flex items-center gap-[5px] rounded-full w-fit',
        sizeVariants[size],
        className
      )}
    >
      {icon}
      {text && <p>{text}</p>}
    </div>
  );
};
