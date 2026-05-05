import { PlaceCarouselCard } from '@/modules/places/place-carousel-card';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PlaceCarouselCard> = {
  title: 'components/ui/carousels/PlaceCarouselCard',
  component: PlaceCarouselCard
};

export default meta;
type Story = StoryObj<typeof PlaceCarouselCard>;

export const Default: Story = {
  args: {
    src: 'https://plus.unsplash.com/premium_photo-1677355911295-b6779bf0f433?q=80&w=3073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
};
