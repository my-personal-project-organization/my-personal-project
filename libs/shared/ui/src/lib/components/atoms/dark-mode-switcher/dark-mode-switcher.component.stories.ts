import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { DarkModeSwitcherComponent } from './dark-mode-switcher.component';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';
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
    const button = canvas.getByTestId<HTMLButtonElement>('dark-mode-button');
    const performTest = async (isDark: boolean) => {
      expect(button).toHaveTextContent(isDark ? 'Dark' : 'Light'); // Check initial state
      await button.click(); // Toggle dark mode
      expect(button).toHaveTextContent(isDark ? 'Light' : 'Dark'); // Check toggled state
      await button.click(); // Toggle back
      expect(button).toHaveTextContent(isDark ? 'Dark' : 'Light'); // Check initial state again
    };

    const isDark = button.textContent?.includes('Dark') ?? false;
    performTest(isDark);
  },
};
