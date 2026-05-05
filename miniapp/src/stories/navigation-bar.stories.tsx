import type { Meta, StoryObj } from '@storybook/react';
import { NavigationBar } from '@/modules/navigation-bar/navigation-bar';
import { HashRouter as Router } from 'react-router-dom';

const meta: Meta<typeof NavigationBar> = {
  title: 'components/ui/NavigationBar',
  component: NavigationBar,
  decorators: [
    (Story) => {
      return (
        <Router>
          <Story />
        </Router>
      );
    }
  ]
};

export default meta;
type Story = StoryObj<typeof NavigationBar>;

export const Default: Story = {
  args: {}
};
