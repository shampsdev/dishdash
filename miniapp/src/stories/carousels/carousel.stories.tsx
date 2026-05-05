import type { Meta, StoryObj } from '@storybook/react';
import { Carousel, CarouselProps } from '@/components/ui/carousel/carousel';
import { PlaceCarouselCard } from '@/modules/places/place-carousel-card';
import { CollectionCard } from '@/modules/collections/collection-carousel-card';

const meta: Meta<typeof Carousel> = {
  title: 'components/ui/carousels/Carousel',
  component: Carousel
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const cards = [
  {
    primaryText: 'Давай отдохнем в СПБ!',
    secondaryText: 'Подборка интересных мест от tg-канала нашей подруги Даши',
    src: 'https://media-cdn.tripadvisor.com/media/photo-s/0e/84/7b/a6/caption.jpg'
  },
  {
    primaryText: 'Telegram-канал команды разработчиков',
    secondaryText: 'Все о нас и наших проектах',
    src: 'https://plus.unsplash.com/premium_photo-1677355911295-b6779bf0f433?q=80&w=3073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    primaryText: 'Ваше мнение о DishDash?',
    secondaryText: 'Всего пара минут вашего времени помогут нам стать лучше :3',
    src: 'https://plus.unsplash.com/premium_photo-1664970900025-1e3099ca757a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];

export const CarouselWithPlaceCards: Story = {
  args: {
    autoPlay: true,
    infinite: true,
    arrows: false,
    className: 'h-fit w-96',
    gutter: 120
  },
  render: (args: CarouselProps) => (
    <Carousel {...args}>
      {cards.map((card, index) => (
        <PlaceCarouselCard key={index} src={card.src} />
      ))}
    </Carousel>
  )
};

export const CarouselWithCollectionCards: Story = {
  args: {
    autoPlay: true,
    infinite: true,
    arrows: false,
    className: 'h-fit w-96'
  },
  render: (args: CarouselProps) => (
    <Carousel {...args}>
      {cards.map((card, index) => (
        <CollectionCard
          key={index}
          primaryText={card.primaryText}
          secondaryText={card.secondaryText}
          onClick={() => alert(`Clicked card: ${card.primaryText}`)}
          src={card.src}
        />
      ))}
    </Carousel>
  )
};
