import { SelectPointMap } from '@/modules/map/select-point-map';
import { StyledMapProps } from '@/modules/map/styled-map';
import { Meta, StoryObj } from '@storybook/react';

const mockProps: StyledMapProps = {
  className: 'w-[360px] h-[640px]'
};

const meta: Meta<typeof SelectPointMap> = {
  title: 'components/ui/SelectPointMap',
  component: SelectPointMap,
  parameters: {
    className: 'w-[360px] h-[640px]'
  }
};

export default meta;

type Story = StoryObj<typeof SelectPointMap>;

export const Default: Story = {
  args: mockProps
};
