import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { DarkModeSwitcherComponent } from './dark-mode-switcher.component';

import { expect, within, waitFor } from 'storybook/test';
import { ButtonComponent } from '../button/button.component';

const meta: Meta<DarkModeSwitcherComponent> = {
  component: DarkModeSwitcherComponent,
  title: 'Shared/UI/Atoms/DarkModeSwitcher',
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
    expect(button).toBeTruthy();

    // Check initial icon (moon or sun)
    let sunIcon = button.querySelector('ui-icon[name="sun"]');
    let moonIcon = button.querySelector('ui-icon[name="moon"]');
    const initialDarkMode = sunIcon !== null;

    // Click to toggle
    button.click();
    await waitFor(() => {
      sunIcon = button.querySelector('ui-icon[name="sun"]');
      moonIcon = button.querySelector('ui-icon[name="moon"]');
      expect(initialDarkMode ? moonIcon : sunIcon).toBeTruthy();
    });

    // Click back to original state
    button.click();
    await waitFor(() => {
      sunIcon = button.querySelector('ui-icon[name="sun"]');
      moonIcon = button.querySelector('ui-icon[name="moon"]');
      expect(initialDarkMode ? sunIcon : moonIcon).toBeTruthy();
    });
  },
};
