import { useParams } from 'react-router-dom';
import { PlacePage } from '@/pages/dashboard/place.page';
import { useEffect, useState } from 'react';
import { Place } from '@/interfaces/place.interface';
import { usePlaces } from '@/shared/hooks/usePlaces';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const { id } = useParams<{ id: string }>(); //placeId
  const { data, updatePlace } = usePlaces();

  const [place, setPlace] = useState<Place | null>(null);

  useEffect(() => {
    setPlace(data?.find((x) => x.id.toString() == id) ?? null);
  }, [id, data]);

  const handleSave = (place: Place) => {
    updatePlace(place);
    toast.success('Place updated');
  };

  return place !== null ? (
    <PlacePage onSave={handleSave} inputPlace={place} />
  ) : (
    <></>
  );
};
