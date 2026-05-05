export type Story = {
  url: string;
  type: 'image' | 'video';
  duration: number;
  title: string;
  description: string;
};

export type StoryCollection = {
  id: string;
  title: string;
  icon: string;
  src: string;
  visible: boolean;
  stories: Story[];
  created_at: string;
};
