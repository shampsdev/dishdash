import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSettingsStore } from '@/shared/stores/settings.store';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const SettingsPage = () => {
  const { api_key, setApiKey } = useSettingsStore();
  const [localKey, setLocalKey] = useState(api_key);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalKey(e.target.value);
  };

  // Handle button click
  const handleSetKey = () => {
    setApiKey(localKey);
    toast.success('key updated');
  };

  return (
    <div className='w-full p-5 justify-center h-full flex'>
      <div className='flex gap-4'>
        <Input
          value={localKey}
          onChange={handleInputChange}
          placeholder={localKey !== '' ? localKey : 'API Key...'}
        />
        <Button variant='outline' onClick={handleSetKey}>
          Update Key
        </Button>
      </div>
    </div>
  );
};
