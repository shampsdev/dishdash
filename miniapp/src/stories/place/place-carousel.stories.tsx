import { PlaceCarousel } from '@/modules/places/place-carousel';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PlaceCarousel> = {
  title: 'components/ui/place/Carousel',
  component: PlaceCarousel
};

export default meta;
type Story = StoryObj<typeof PlaceCarousel>;

const cards = [
  {
    src: 'https://i.timeout.ru/pix/565649.jpeg'
  },
  {
    src: 'https://sun9-66.userapi.com/impg/Qp1FYQwYcKAuMiO9erKBEcLmuw-6xv88zHj7Ow/rpovW5fbQpk.jpg?size=492x604&quality=95&sign=8caf9ba512df717c09ee9db6264622f2&type=album'
  },
  {
    src: 'https://tblr.blob.core.windows.net/images/427dc4d4-5511-303c-820c-87e7e22f6bea.jpg'
  }
];

export const Default: Story = {
  args: {
    place: {
      id: 0,
      title: 'Oversize pizza club',
      shortDescription: '',
      description: '',
      images: cards.flatMap((x) => x.src),
      url: null,
      location: {
        lat: 0,
        lon: 0
      },
      address: '',
      priceAvg: 0,
      reviewRating: 0,
      reviewCount: 0,
      tags: [
        {
          id: 0,
          name: 'Кафе',
          icon: '',
          order: 0,
          visible: false
        }
      ],
      updatedAt: new Date(),
      boost: null
    }
  },
  render: (args) => (
    <div className='w-[500px]'>
      <PlaceCarousel {...args} />
    </div>
  )
};
