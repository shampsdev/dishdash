import type { Meta, StoryObj } from '@storybook/react';
import { CollectionCard } from '@/modules/collections/collection-carousel-card';

const meta: Meta<typeof CollectionCard> = {
  title: 'components/ui/collection/Card',
  component: CollectionCard
};

export default meta;
type Story = StoryObj<typeof CollectionCard>;

export const Default: Story = {
  args: {
    primaryText: 'Давай отдохнем в СПБ!',
    secondaryText: 'Подборка интересных мест от tg-канала нашей подруги Даши',
    src: 'https://media-cdn.tripadvisor.com/media/photo-s/0e/84/7b/a6/caption.jpg'
  },
  render: (args) => <CollectionCard {...args} />
};
