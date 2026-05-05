import { axiosInstance } from '../instance/axios.instance';
import { StoryCollection } from '../interfaces/story.interface';

export const fetchStoryCollections = async () => {
  try {
    const response = await axiosInstance.get<StoryCollection[]>('/api/v1/stories');
    return response.data;
  } catch (err) {
    console.error('Error fetching place:', err);
    return undefined;
  }
};
