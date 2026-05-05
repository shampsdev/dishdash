import { cn } from '@/lib/utils';
import { hapticFeedback } from '@telegram-apps/sdk-react';

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children: JSX.Element | string;
}

export const Button = ({ onClick, className, children }: ButtonProps) => {

  const onClickWithHapticFeedback = () => {
    if (onClick === undefined) return;
    onClick()

    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light');
    }
  }

  return (
    <div
      className={cn(
        'select-none bg-accent-foreground active:opacity-90 cursor-pointer h-fit py-2 px-4 rounded-3xl',
        className
      )}
      onClick={onClickWithHapticFeedback}
    >
      <p className="font-medium text-white text-[16px]">{children}</p>
    </div>
  );
};
