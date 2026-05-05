import { cn } from '@/lib/utils';

interface NavigationIconProps {
  children?: JSX.Element;
  title: string;
  active?: boolean;
  onClick?: () => void;
}

export const NavigationIcon = ({
  children,
  active,
  title,
  onClick
}: NavigationIconProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        active ? '' : 'opacity-30',
        'flex flex-col items-center gap-1 p-2 pt-3'
      )}
    >
      <div>{children}</div>
      <p className="select-none text-[10px]">{title}</p>
    </div>
  );
};
