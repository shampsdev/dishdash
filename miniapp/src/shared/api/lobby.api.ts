import { Lobby } from '@/modules/swipes/interfaces/lobby.interface';
import { Settings } from '@/modules/swipes/interfaces/settings/settings.interface';
import { axiosInstance } from '@/shared/instance/axios.instance';

export const fetchLobby = async (id: string): Promise<Lobby | undefined> => {
  try {
    const response = await axiosInstance.get<Lobby>(`/api/v1/lobbies/id/${id}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching lobby:', err);
    return undefined;
  }
};

export const fetchLatestLobbies = async (
  count: number | undefined
): Promise<Lobby[] | undefined> => {
  try {
    const response = await axiosInstance.get<Lobby[]>(
      `/api/v1/lobbies/latest${count ? `?limit=${count}` : ''}`
    );
    return response.data;
  } catch (err) {
    console.error('Error fetching lobby:', err);
    return undefined;
  }
};

export const postLobby = async (
  settings: Settings
): Promise<Lobby | undefined> => {
  try {
    const response = await axiosInstance.post<Lobby>(
      '/api/v1/lobbies',
      settings
    );
    return response.data;
  } catch (err) {
    console.error('Error fetching lobby:', err);
    return undefined;
  }
};
