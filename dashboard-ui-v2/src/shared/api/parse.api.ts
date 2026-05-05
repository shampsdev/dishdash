import { Place } from '@/interfaces/place.interface';
import axios from 'axios';
import { useSettingsStore } from '../stores/settings.store';
import { API_URL } from '../constants';

export const parsePlace = async (url: string) => {
  const api_key = useSettingsStore.getState().api_key;

  const response = await axios.post<Omit<Place, 'id'>>(
    `${API_URL}/api/v1/places/parse`,
    {
      url,
    },
    {
      headers: {
        'X-API-Token': api_key,
      },
    }
  );

  return response.data;
};

interface UploadImage {
  url: string;
}

export const uploadImageByUrl = async (url: string) => {
  const api_key = useSettingsStore.getState().api_key;

  const response = await axios.post<UploadImage>(
    `${API_URL}/api/v1/images/upload/by_url`,
    {
      url,
      directory: 'place',
    },
    {
      headers: {
        'X-API-Token': api_key,
      },
    }
  );

  return response.data;
};

export const uploadImageByFile = async (file: File) => {
  const api_key = useSettingsStore.getState().api_key;

  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<UploadImage>(
    `${API_URL}/api/v1/images/upload/by_file?dir=places`,
    formData,
    {
      headers: {
        'X-API-Token': api_key,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};
