import { Card } from '@/modules/swipes/interfaces/card.interface';
import { axiosInstance } from '../instance/axios.instance';
import { Location } from '../interfaces/location.interface';

export const fetchPlace = async (id: string) => {
  try {
    const response = await axiosInstance.get<Card>(`/api/v1/places/id/${id}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching place:', err);
    return undefined;
  }
};

export const fetchAddress = async (location: Location) => {
  try {
    const response = await axiosInstance.post<{ address: string }>(
      '/api/v1/places/address',
      location
    );
    return response.data;
  } catch (err) {
    console.error('Error fetching place:', err);
    return undefined;
  }
};
