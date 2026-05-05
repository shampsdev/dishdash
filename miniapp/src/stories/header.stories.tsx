import type { Meta, StoryObj } from '@storybook/react';
import type { User } from '@/shared/interfaces/user.interface';
import { Header } from '@/components/ui/header';

const meta: Meta<typeof Header> = {
  title: 'components/ui/Header',
  component: Header
};

export default meta;
type Story = StoryObj<typeof Header>;

const mockUser: User = {
  name: 'Иван',
  avatar: 'https://t.me/i/userpic/320/l7ONTLqkvTR8zaSGvrobufOmH-BN65JS1ZM1-5kjEsQ.svg',
  id: '',
  telegram: 0
};

export const Morning: Story = {
  args: {
    user: mockUser,
    now: new Date('2023-01-01T08:00:00')
  }
};

export const Afternoon: Story = {
  args: {
    user: mockUser,
    now: new Date('2023-01-01T14:00:00')
  }
};

export const Evening: Story = {
  args: {
    user: mockUser,
    now: new Date('2023-01-01T19:00:00')
  }
};

export const Night: Story = {
  args: {
    user: mockUser,
    now: new Date('2023-01-01T23:30:00')
  }
};
