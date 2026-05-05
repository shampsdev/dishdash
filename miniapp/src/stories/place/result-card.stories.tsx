import { ResultCard } from '@/modules/swipes/results/result-card';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ResultCard> = {
  title: 'components/ui/place/ResultCard',
  component: ResultCard
};

export default meta;
type Story = StoryObj<typeof ResultCard>;

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
    card: {
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
    },
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
  render: (args) => (
    <div className="w-[400px]">
      <ResultCard {...args} />
    </div>
  )
};
