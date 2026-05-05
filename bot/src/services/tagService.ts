import axios from "axios";
import { API_BASE_URL } from "../config";

export interface Tag {
  id?: number;
  name: string;
  icon: string;
}

export const getTags = async (): Promise<Tag[]> => {
  const response = await axios.get<Tag[]>(`${API_BASE_URL}/places/tags`);
  return response.data;
};

export const createTag = async (tag: Tag): Promise<Tag> => {
  const response = await axios.post<Tag>(`${API_BASE_URL}/places/tags`, tag);
  return response.data;
};

export const updateTag = async (id: number, tag: Tag): Promise<Tag> => {
  const response = await axios.put<Tag>(
    `${API_BASE_URL}/places/tag/${id}`,
    tag,
  );
  return response.data;
};

export const deleteTag = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/places/tag/${id}`);
};
