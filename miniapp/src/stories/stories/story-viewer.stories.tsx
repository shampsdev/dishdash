import StoryViewer, { StoryData } from '@/components/ui/stories/story-viewer';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'components/ui/story/StoryViewer',
  component: StoryViewer
} satisfies Meta<typeof StoryViewer>;

export default meta;

type Story = StoryObj<typeof StoryViewer>;

const sampleStories: StoryData[] = [
  {
    url: 'https://plus.unsplash.com/premium_photo-1664970900025-1e3099ca757a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    type: 'image',
    duration: 3000,
    title: 'Давай отдохнем в СПБ!',
    description: 'Подборка интересных мест от tg-канала нашей подруги Даши'
  },
  {
    url: 'https://images.unsplash.com/photo-1540377904109-89bf2d99918a?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    type: 'image',
    duration: 3000,
    title: 'Давай отдохнем в СПБ!',
    description: 'Подборка интересных мест от tg-канала нашей подруги Даши'
  },
  {
    url: 'https://images.unsplash.com/photo-1598959652545-c0230cdbb01f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    type: 'image',
    duration: 3000,
    title: 'Давай отдохнем в СПБ!',
    description: 'Подборка интересных мест от tg-канала нашей подруги Даши'
  }
];

export const Example: Story = {
  render: (args) => (
    <div style={{ width: 360, height: 640 }}>
      <StoryViewer {...args} />
    </div>
  ),
  args: {
    stories: sampleStories,
    fade: true,
    progressBarSettings: { progressBarPosition: 'bottom', padding: 25 },
    onComplete: () => console.log('All stories finished!')
  }
};
