import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarStack } from '@/components/ui/avatar-stack';

const meta: Meta<typeof Avatar> = {
  title: 'components/ui/Avatar',
  component: Avatar
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  args: {
    src: 'https://t.me/i/userpic/320/l7ONTLqkvTR8zaSGvrobufOmH-BN65JS1ZM1-5kjEsQ.svg',
    fallback: 'AB'
  }
};

export const WithFallbackText: Story = {
  args: {
    src: '',
    fallback: 'JD'
  }
};

export const WithFallbackElement: Story = {
  args: {
    src: '',
    fallbackElement: <div className="text-sm text-primary">👤</div>
  }
};

export const CustomStyled: Story = {
  args: {
    src: '',
    fallback: 'XY',
    style: {
      borderRadius: '8px',
      width: '40px',
      height: '40px'
    }
  }
};

export const WithAvatarStack: StoryObj = {
  render: () => (
    <AvatarStack
      avatars={[
        {
          src: 'https://t.me/i/userpic/320/l7ONTLqkvTR8zaSGvrobufOmH-BN65JS1ZM1-5kjEsQ.svg',
          fallback: 'V'
        },
        {
          src: 'https://t.me/i/userpic/320/qLQNMafU3MP_wIiGACdOadDKNruANnV-Ja30gYgL0R8.svg',
          fallback: 'M'
        },
        {
          src: 'https://t.me/i/userpic/320/s6B8nJP9COE376ut4geQ3xw3mJFRNb7BCoEJSmKitic.svg',
          fallback: 'C'
        },
        {
          src: 'https://randomuser.me/api/portraits/women/4.jpg',
          fallback: 'D'
        }
      ]}
    />
  )
};
