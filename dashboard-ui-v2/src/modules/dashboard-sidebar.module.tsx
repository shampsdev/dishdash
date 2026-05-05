import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Outlet, useNavigate } from 'react-router-dom';
import { usePlaces } from '@/shared/hooks/usePlaces';

export default function DashboardSidebar() {
  const { data: places } = usePlaces();
  const [filter, setFilter] = useState('');

  const navigate = useNavigate();

  const filteredPlaces = places?.filter((place) =>
    place.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <div className='flex flex-col min-w-[250px] w-[250px] border-secondary border-r'>
        <div className='p-5 pt-4 space-y-5 border-secondary border-b'>
          <h1 className='text-xl'>All Places</h1>
          <Input
            placeholder='Filter places...'
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className='h-full divide-gray-100 w-full overflow-y-scroll no-scrollbar'>
          {filteredPlaces?.map((x, index) => (
            <div
              key={`${x.id}_${index}`}
              onClick={() => {
                navigate(`${x.id}`);
              }}
              className='cursor-pointer px-3 py-2 h-24 hover:bg-secondary w-full'
            >
              <p>
                {x.title}{' '}
                <span className='text-muted-foreground text-xs'>{x.id}</span>
              </p>
              <p className='text-muted-foreground line-clamp-2 text-sm'>
                {x.address}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Outlet />
    </>
  );
}
