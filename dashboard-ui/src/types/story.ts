export interface StoryData {
  title: string;
  description: string;
  type: string;
  url: string;
  duration: number;
}

export interface Story {
  id?: string;
  title: string;
  icon: string;
  src: string;
  stories: StoryData[];
  visible: boolean;
  created_at?: string;
}

export interface StoryFilter {
  title?: string;
  visible?: boolean;
}

export interface StoryPatch {
  id?: string;
  title?: string;
  icon?: string;
  src?: string;
  stories?: StoryData[];
  visible?: boolean;
} 