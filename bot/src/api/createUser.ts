import axios from "axios";
import { API_BASE_URL } from "src/config";
import User from "./interfaces/User";

export const createUser = async (user: User): Promise<User | null> => {
  try {
    const res = await axios.post<User>(`${API_BASE_URL}/users`, user);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
