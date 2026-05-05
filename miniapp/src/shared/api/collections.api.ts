import { Collection } from '../interfaces/collection.interface';
import { axiosInstance } from '../instance/axios.instance';

export const fetchCollection = async (
  id: string
): Promise<Collection | undefined> => {
  try {
    const response = await axiosInstance.get<Collection>(
      `/api/v1/collections/id/${id}`
    );
    return response.data;
  } catch (err) {
    console.error('Error fetching lobby:', err);
    return undefined;
  }
};

export const fetchCollections = async (): Promise<Collection[] | undefined> => {
  try {
    const response = await axiosInstance.get<Collection[]>(
      '/api/v1/collections'
    );
    return response.data;
  } catch (err) {
    console.error('Error fetching collections:', err);
    return undefined;
  }
};

export const fetchCollectionFavorite = async (): Promise<
  Collection | undefined
> => {
  try {
    const response = await axiosInstance.get<Collection>(
      '/api/v1/collections/favorites'
    );
    return response.data;
  } catch (err) {
    console.error('Error fetching lobby:', err);
    return undefined;
  }
};

export const addtoFavorites = async (id: number): Promise<void> => {
  try {
    await axiosInstance.post(`/api/v1/collections/favorites/add_place/${id}`);
  } catch (err) {
    console.error('Error adding to favorites:', err);
  }
};

export const removeFromFavorites = async (id: number): Promise<void> => {
  try {
    await axiosInstance.post(
      `/api/v1/collections/favorites/remove_place/${id}`
    );
  } catch (err) {
    console.error('Error removing from favorites:', err);
  }
};
