import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CSSProperties, ReactElement } from 'react';

export interface AvatarProps {
  src: string;
  fallback?: string;
  fallbackElement?: ReactElement;
  className?: string;
  style?: CSSProperties;
}

export const Avatar = ({
  src,
  fallback,
  style,
  fallbackElement,
  className
}: AvatarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={style}
      className={cn(
        'h-[32px] w-[32px] aspect-square bg-background rounded-full overflow-hidden flex items-center justify-center',
        className
      )}
    >
      {src !== '' ? (
        <img
          className="w-full h-full object-cover touch-none select-none"
          src={src}
        />
      ) : fallbackElement !== undefined ? (
        fallbackElement
      ) : (
        <span className="text-primary font-medium text-xs">{fallback}</span>
      )}
    </motion.div>
  );
};
