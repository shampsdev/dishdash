import { Icons } from '@/assets/icons/icons';

interface NavigationButtonProps {
  onClick?: () => void;
  active?: boolean;
}

export const NavigationButton = ({
  active,
  onClick
}: NavigationButtonProps) => (
  <div
    className="absolute active:opacity-75 right-3 bottom-56 z-[1000] flex justify-center cursor-pointer rounded-full items-center h-12 w-12 bg-[#B6B6B6]/20 backdrop-blur-sm p-[5px]"
    onClick={onClick}
  >
    <Icons.navigation
      fill={active ? 'var(--accent-foreground)' : 'white'}
      className="-translate-x-[8%] translate-y-[8%]"
    />
  </div>
);
