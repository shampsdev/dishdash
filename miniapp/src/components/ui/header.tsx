import { User } from '@/shared/interfaces/user.interface';

interface HeaderProps {
  user: User;
  now?: Date; // 👈 добавляем сюда
}

const getGreeting = (date: Date) => {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) return 'Доброе утро';
  if (hour >= 12 && hour < 17) return 'Добрый день';
  if (hour >= 17 && hour < 22) return 'Добрый вечер';
  return 'Доброй ночи';
};

export const Header = ({ user, now = new Date() }: HeaderProps) => {
  const greeting = getGreeting(now);

  return (
    <div className="flex gap-2 items-center w-[92%] mx-auto min-w-fit">
      <img className="h-10 w-10 rounded-full" src={user.avatar} />
      <div className="flex flex-col justify-center">
        <span className="text-[14px] text-secondary-foreground font-medium">
          {greeting}!
        </span>
        <span className="text-[20px] font-semibold leading-none">{user.name}</span>
      </div>
    </div>
  );
};
