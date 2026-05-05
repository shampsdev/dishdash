import axios from "axios";
import { API_BASE_URL } from "src/config";
import logger from "src/utils/logger";

interface LobbyLocationProps {
  location: {
    lat: number;
    lon: number;
  };
}

interface LobbyData {
  id: string;
  location: {
    lon: number;
    lat: number;
  };
}

export const createLobby = async ({ location }: LobbyLocationProps) => {
  try {
    const data = await axios.post<LobbyData>(`${API_BASE_URL}/lobbies`, {
      location,
    });

    return data;
  } catch (err) {
    logger.error(err);
  }
};

export const findLobby = async ({ location }: LobbyLocationProps) => {
  try {
    return await axios.post<LobbyData>(`${API_BASE_URL}/lobbies/nearest`, {
      location,
    });
  } catch (err) {
    logger.error(err);
  }
};
