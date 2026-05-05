import { Tag } from '@/interfaces/place.interface';
import axios from 'axios';
import { API_URL } from '../constants';
import { useSettingsStore } from '../stores/settings.store';

export const fetchTags = async (): Promise<Tag[] | undefined> => {
  const api_key = useSettingsStore.getState().api_key;

  try {
    const response = await axios.get<Tag[]>(`${API_URL}/api/v1/places/tag`, {
      headers: {
        'X-API-Token': api_key,
      },
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching tags:', err);
    return undefined;
  }
};
