import { Icons } from '@/assets/icons/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { NavigationIcon } from './navigation-icon';

interface NavigationBarProps {
  onClick?: () => void;
}

export const NavigationBar = ({ onClick }: NavigationBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split('/')[1];

  const onMainButtonClick = () => navigate('/map');

  return (
    <div>
      <Outlet />
      <div
        id='navbar'
        onClick={onClick}
        className="absolute bottom-0 justify-around flex h-20 bg-[#171717] rounded-t-3xl right-0 left-0 z-50"
      >
        <NavigationIcon
          title="История"
          active={path === 'history'}
          onClick={() => navigate('/history')}
        >
          <Icons.archive />
        </NavigationIcon>

        <NavigationIcon
          title="Подборки"
          active={path === 'collections'}
          onClick={() => navigate('/collections')}
        >
          <Icons.folder />
        </NavigationIcon>

        <div
          onClick={onMainButtonClick}
          className="h-[45px] w-[45px] outline outline-[#171717] outline-8 bg-primary rounded-full text-secondary flex justify-center items-center active:opacity-80"
        >
          <Icons.plus />
        </div>

        <NavigationIcon
          title="Главная"
          active={path === ''}
          onClick={() => navigate('/')}
        >
          <Icons.home />
        </NavigationIcon>

        <NavigationIcon
          title="Избранное"
          active={path === 'saved'}
          onClick={() => navigate('/saved')}
        >
          <Icons.largeSaved />
        </NavigationIcon>
      </div>
    </div>
  );
};
