export type CollectionType = 'basic' | 'favorites';

export interface Collection {
  id?: string;
  name: string;
  description: string;
  avatar: string;
  order: number;
  ownerId: string;
  places: number[];
  type: CollectionType;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollectionPatch {
  id: string;
  name?: string;
  description?: string;
  avatar?: string;
  order?: number;
  ownerId?: string;
  places?: number[];
  type?: CollectionType;
  visible?: boolean;
}

export interface CollectionFilter {
  search?: string;
  types?: CollectionType[];
  visible?: boolean;
  ownerID?: string;
} 