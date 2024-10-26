import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { DarkModeSwitcherComponent } from './dark-mode-switcher.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { ButtonComponent } from '../button/button.component';

const meta: Meta<DarkModeSwitcherComponent> = {
  component: DarkModeSwitcherComponent,
  title: 'DarkModeSwitcherComponent',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      //   declarations: [ButtonComponent],
      imports: [ButtonComponent],
    }),
  ],
};
export default meta;
type Story = StoryObj<DarkModeSwitcherComponent>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByTestId('dark-mode-button')).toBeTruthy();
  },
};

export const DarkMode: Story = {
  render: (args) => ({
    props: args,
    template: `
        <ui-dark-mode-switcher></ui-dark-mode-switcher>
          <ui-button text="Click me!" color="secondary" type="button"></ui-button> 
          <ui-button text="Click me!" color="primary" type="button"></ui-button> 
          <ui-button text="Click me!" color="danger" type="button"></ui-button> 
      `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('dark-mode-button');
    expect(
      canvas.getByText(
        'This text should change color when dark mode is enabled.',
      ),
    ).toHaveClass('text-gray-700');

    await button.click();
    expect(
      canvas.getByText(
        'This text should change color when dark mode is enabled.',
      ),
    ).toHaveClass('text-gray-200');
  },
};
