import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from '@/components/ui/tag';
import { Icons } from '@/assets/icons/icons';

const meta: Meta<typeof Tag> = {
  title: 'components/ui/Tag',
  component: Tag
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    icon: <Icons.cards />,
    text: '10 мест'
  }
};
