import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@/components/ui/swipes/card';
import { SwipableCard } from '@/components/ui/swipes/swipable-card';

const meta: Meta<typeof Card> = {
  title: 'components/ui/swipes/Card',
  component: Card
};

export default meta;
type Story = StoryObj<typeof Card>;

const card = {
  id: 0,
  title: 'Oversize pizza club',
  shortDescription: '',
  description:
    'Пиццерия Oversize — это место, где вы можете попробовать огромные треугольные пиццы с бесконечным количеством начинок. Гости отмечают, что пицца здесь очень вкусная и тонкая, а тесто просто тает во рту. Кроме того, в меню есть паста, супы, десерты и напитки.',
  images: [
    'https://i.timeout.ru/pix/565649.jpeg',
    'https://sun9-66.userapi.com/impg/Qp1FYQwYcKAuMiO9erKBEcLmuw-6xv88zHj7Ow/rpovW5fbQpk.jpg?size=492x604&quality=95&sign=8caf9ba512df717c09ee9db6264622f2&type=album',
    'https://tblr.blob.core.windows.net/images/427dc4d4-5511-303c-820c-87e7e22f6bea.jpg'
  ],
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
    },
    {
      id: 0,
      name: 'Ресторан',
      icon: '',
      order: 0,
      visible: false
    }
  ],
  updatedAt: new Date(),
  boost: null
};

export const Default: Story = {
  args: {
    card
  },
  render: (args) => {
    return (
      <div style={{ width: 365, height: 625 }}>
        <Card {...args} />
      </div>
    );
  }
};

export const WithSwipable: Story = {
  args: {
    card
  },
  render: (args) => {
    return (
      <div style={{ width: 365, height: 625 }}>
        <SwipableCard>
          <Card {...args} />
        </SwipableCard>
      </div>
    );
  }
};

export const WithLikes: Story = {
  args: {
    card,
    likes: [
      {
        name: '',
        avatar:
          'https://t.me/i/userpic/320/l7ONTLqkvTR8zaSGvrobufOmH-BN65JS1ZM1-5kjEsQ.svg',
        id: '123',
        telegram: 1
      },
      {
        name: '',
        avatar:
          'https://t.me/i/userpic/320/qLQNMafU3MP_wIiGACdOadDKNruANnV-Ja30gYgL0R8.svg',
        id: '123',
        telegram: 2
      },
      {
        name: '',
        avatar:
          'https://t.me/i/userpic/320/s6B8nJP9COE376ut4geQ3xw3mJFRNb7BCoEJSmKitic.svg',
        id: '123',
        telegram: 2
      }
    ]
  },
  render: (args) => {
    return (
      <div style={{ width: 365, height: 625 }}>
        <Card {...args} />
      </div>
    );
  }
};
