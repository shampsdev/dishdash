import { StoryButton } from '@/components/ui/stories/story-button';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'components/ui/story/StoryButton',
  component: StoryButton,
  argTypes: {
    icon: {
      control: 'select',
      options: ['flame', 'people', 'forward', null]
    }
  }
} satisfies Meta<typeof StoryButton>;

export default meta;
type Story = StoryObj<typeof StoryButton>;

export const StoryButtonIcon1: Story = {
  args: {
    background:
      'https://images.unsplash.com/photo-1580644043501-627f569f7e25?q=80&w=2399&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Новая подборка!',
    seen: false,
    icon: 'flame'
  }
};

export const StoryButtonIcon2: Story = {
  args: {
    background:
      'https://images.unsplash.com/photo-1580644043501-627f569f7e25?q=80&w=2399&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Новая подборка!',
    seen: false,
    icon: 'people'
  }
};

export const StoryButtonSeen: Story = {
  args: {
    background:
      'https://images.unsplash.com/photo-1580644043501-627f569f7e25?q=80&w=2399&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Новая подборка!',
    seen: true,
    icon: 'forward'
  }
};
