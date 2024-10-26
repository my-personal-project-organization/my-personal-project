import type { Meta, StoryObj } from '@storybook/angular';
import { DropdownComponent } from './dropdown.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<DropdownComponent> = {
  component: DropdownComponent,
  title: 'DropdownComponent',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    options: { control: 'select' },
    placeholder: { control: 'text' },
    selectedOption: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<DropdownComponent>;

export const Default: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    placeholder: 'Select an option',
    selectedOption: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Select an option/gi)).toBeTruthy();
    expect(canvas.getByRole('button')).toBeTruthy();
  },
};

export const WithSelectedOption: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    placeholder: 'Select an option',
    selectedOption: 'Option 2',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Option 2/gi)).toBeTruthy();
    expect(canvas.getByRole('button')).toBeTruthy();
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    placeholder: 'Choose an option',
    selectedOption: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Choose an option/gi)).toBeTruthy();
    expect(canvas.getByRole('button')).toBeTruthy();
  },
};

export const WithFullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    placeholder: 'Choose an option',
    selectedOption: null,
  },
};
