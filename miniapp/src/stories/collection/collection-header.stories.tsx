import type { Meta, StoryObj } from '@storybook/react';
import { CollectionHeader } from '@/modules/collections/collection-header';

const meta: Meta<typeof CollectionHeader> = {
  title: 'components/ui/collection/Header',
  component: CollectionHeader
};

export default meta;
type Story = StoryObj<typeof CollectionHeader>;

export const Default: Story = {
  args: {
    collection: {
      id: '',
      name: 'Давай отдохнем в СПБ!',
      description: 'Подборка интересных мест от tg-канала нашей подруги Даши',
      avatar:
        'https://images.unsplash.com/photo-1551005756-fd0657e8fbf2?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      createdAt: new Date(),
      updatedAt: new Date(),
      places: []
    }
  }
};
