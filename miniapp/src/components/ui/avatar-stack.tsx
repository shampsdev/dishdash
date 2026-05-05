import { Avatar, AvatarProps } from '@/components/ui/avatar';

export const AvatarStack = ({ avatars }: { avatars: AvatarProps[] }) => {
  return (
    <div className="relative h-7 w-16">
      {avatars.slice(0, 3).map((avatar, index) => {
        return (
          <Avatar
            key={`av_${index}`}
            className='top-1/2 h-[32px] w-[32px] outline outline-[3px] outline-secondary'
            style={{
              right: index * 18,
              top: '50%',
              translate: '0 -50%',
              position: 'absolute'
            }}
            src={avatar.src}
            fallback={'?'}
          />
        );
      })}
      {avatars.length > 3 && (
        <div className="text-[60%] font-medium absolute -right-2 -top-[10%] bg-accent-foreground rounded-[20px] px-[7%] pr-[10%]">
          +{avatars.length - 3}
        </div>
      )}
    </div>
  );
};
