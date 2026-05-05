import { useDashboardStore } from '@/shared/stores/places.store';
import { Inbox, Map, MapPinPlus, MoonIcon, Settings2, Tag } from 'lucide-react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { fetchTags } from '@/shared/api/tags.api';

import shamps from '@/assets/shamps.png';
import { useDarkMode } from '@/shared/providers/dark-mode.provider';

export const Sidebar = () => {
  const navigate = useNavigate();

  const { setTags } = useDashboardStore();
  const { toggleDark } = useDarkMode();

  useEffect(() => {
    fetchTags().then((x) => {
      if (x) setTags(x);
    });
  }, [setTags]);

  return (
    <div className='flex h-svh text-left'>
      <div className='h-svh flex p-3 flex-col items-center border-r border-r-secondary space-y-3 min-w-14'>
        <div
          onClick={() => navigate('/')}
          className='text-primary h-8 cursor-pointer w-8 bg-black p-2 rounded-md flex items-center justify-center'
        >
          <img src={shamps} />
        </div>
        <div
          onClick={() => navigate('/dashboard')}
          className='h-8 w-8 cursor-pointer hover:bg-secondary p-2 rounded-md flex items-center justify-center'
        >
          <Inbox />
        </div>
        <div
          onClick={() => navigate('/tags')}
          className='h-8 w-8 cursor-pointer hover:bg-secondary p-2 rounded-md flex items-center justify-center'
        >
          <Tag />
        </div>
        <div
          onClick={() => navigate('/add-place')}
          className='h-8 w-8 cursor-pointer hover:bg-secondary p-2 rounded-md flex items-center justify-center'
        >
          <MapPinPlus />
        </div>
        <div
          onClick={() => navigate('/map')}
          className='h-8 w-8 cursor-pointer hover:bg-secondary p-2 rounded-md flex items-center justify-center'
        >
          <Map />
        </div>
        <div
          onClick={() => navigate('/settings')}
          className='h-8 w-8 cursor-pointer hover:bg-secondary p-2 rounded-md flex items-center justify-center'
        >
          <Settings2 />
        </div>
        <div
          onClick={() => toggleDark()}
          className='h-8 w-8 cursor-pointer hover:bg-secondary p-2 rounded-md flex items-center justify-center'
        >
          <MoonIcon />
        </div>
      </div>
      <Outlet />
    </div>
  );
};
