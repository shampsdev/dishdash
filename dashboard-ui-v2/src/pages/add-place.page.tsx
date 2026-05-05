import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Place } from '@/interfaces/place.interface';
import { PlacePage } from '@/pages/dashboard/place.page';
import { parsePlace } from '@/shared/api/parse.api';
import { usePlaces } from '@/shared/hooks/usePlaces';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const AddPlacePage = () => {
  const [url, setUrl] = useState('');
  const [parsedPlace, setParsedPlace] = useState<Omit<Place, 'id'>>({
    address: '',
    description: '',
    images: [],
    location: { lat: 0, lon: 0 },
    priceAvg: 0,
    reviewCount: 0,
    reviewRating: 0,
    shortDescription: '',
    tags: [],
    title: '',
    updatedAt: '',
    boost: 0,
    boostRadius: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { savePlace } = usePlaces();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleParseUrl = async () => {
    setError('');
    if (!url) {
      setError('URL cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      const place = await parsePlace(url);
      setParsedPlace(place);
    } catch {
      setError('Failed to parse the place. Please check the URL or API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (place: Place) => {
    const newPlace = await savePlace.mutateAsync(place);
    navigate(`/dashboard/${newPlace.id}`);
    toast.success('Place saved successfully!');
  };

  return (
    <div className='w-full h-full overflow-y-scroll no-scrollbar m-5 flex flex-col pb-10'>
      {/* URL Input Section */}
      <div className='w-full p-5 justify-center gap-4 flex'>
        <div className='w-[40%] flex gap-4'>
          <Input
            value={url}
            onChange={handleInputChange}
            placeholder='Enter the URL...'
          />
          <Button variant='outline' onClick={handleParseUrl} disabled={loading}>
            {loading ? 'Parsing...' : 'Parse URL'}
          </Button>
        </div>
      </div>

      {error && <p className='text-red-500 text-center mt-2'>{error}</p>}

      <PlacePage inputPlace={{ ...parsedPlace, id: 0 }} onSave={handleSave} />
    </div>
  );
};
