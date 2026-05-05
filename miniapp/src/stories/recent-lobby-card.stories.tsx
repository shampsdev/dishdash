import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { RecentLobbyCard } from '@/components/ui/recent-lobby-card';
import { Lobby } from '@/modules/swipes/interfaces/lobby.interface';
import { Tag } from '@/shared/interfaces/tag.interface';

const mockTags: Tag[] = [
  {
    id: 0,
    name: 'Ресторан',
    icon: '',
    order: 0,
    visible: false
  },
  {
    id: 0,
    name: 'Кафе',
    icon: '',
    order: 0,
    visible: false
  }
];

const mockLobby: Lobby = {
  id: '123',
  createdAt: new Date().toISOString(),
  state: 'lobby',
  type: 'classicPlaces',
  settings: {
    type: 'classicPlaces'
  },
  users: [
    {
      id: '',
      name: 'vaniog',
      avatar:
        'https://t.me/i/userpic/320/l7ONTLqkvTR8zaSGvrobufOmH-BN65JS1ZM1-5kjEsQ.svg',
      telegram: 0
    },
    {
      id: '',
      name: 'Настя',
      avatar:
        'https://t.me/i/userpic/320/qLQNMafU3MP_wIiGACdOadDKNruANnV-Ja30gYgL0R8.svg',
      telegram: 0
    },
    {
      id: '',
      name: 'mike',
      avatar:
        'https://t.me/i/userpic/320/s6B8nJP9COE376ut4geQ3xw3mJFRNb7BCoEJSmKitic.svg',
      telegram: 0
    },
    {
      id: '',
      name: 'mike',
      avatar:
        'https://t.me/i/userpic/320/s6B8nJP9COE376ut4geQ3xw3mJFRNb7BCoEJSmKitic.svg',
      telegram: 0
    }
  ]
};

const meta: Meta<typeof RecentLobbyCard> = {
  title: 'components/ui/RecentLobbyCard',
  component: RecentLobbyCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ],
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type StoryArgs = React.ComponentProps<typeof RecentLobbyCard> & {
  createdAt: string | Date;
};

export const Default: StoryObj<StoryArgs> = {
  args: {
    createdAt: new Date(),
    tags: mockTags,
    lobby: mockLobby
  },
  argTypes: {
    createdAt: {
      control: { type: 'date' },
      name: 'Дата создания лобби'
    }
  },
  render: ({ createdAt, tags, lobby }) => {
    const updatedLobby: Lobby = {
      ...lobby,
      createdAt: new Date(createdAt).toISOString()
    };

    return <RecentLobbyCard lobby={updatedLobby} tags={tags} collections={[]} />;
  }
};
