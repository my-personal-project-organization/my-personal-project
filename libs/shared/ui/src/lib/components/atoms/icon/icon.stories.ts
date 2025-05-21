import type { Meta, StoryObj } from '@storybook/angular';
import { expect, within } from '@storybook/test';
import { IconComponent } from './icon.component';
import { iconsJson } from './icons';

const meta: Meta<IconComponent> = {
  component: IconComponent,
  title: 'Shared/UI/Atoms/Icon',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: 'select',
      options: iconsJson.map((icon) => icon.name),
      table: {
        type: { summary: 'IconName' },
        defaultValue: { summary: undefined },
      },
    },
    size: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<IconComponent>;

export const Github: Story = {
  args: {
    name: 'github',
    size: 24,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const svg = canvas.getByTestId('github');
    expect(svg).toBeInTheDocument();
    expect(svg.getAttribute('width')).toBe('24px');
    expect(svg.getAttribute('height')).toBe('24px');
  },
};

export const Home: Story = {
  args: {
    name: 'home',
    size: 32,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const svg = canvas.getByTestId('home');
    expect(svg).toBeInTheDocument();
    expect(svg.getAttribute('width')).toBe('32px');
    expect(svg.getAttribute('height')).toBe('32px');
  },
};

export const LargeGithub: Story = {
  args: {
    name: 'github',
    size: '3rem',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const svg = canvas.getByTestId('github');
    expect(svg).toBeInTheDocument();
    expect(svg.style.width).toBe('3rem');
    expect(svg.style.height).toBe('3rem');
  },
};

export const SmallHome: Story = {
  args: {
    name: 'home',
    size: 12,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const svg = canvas.getByTestId('home');
    expect(svg).toBeInTheDocument();
    expect(svg.getAttribute('width')).toBe('12px');
    expect(svg.getAttribute('height')).toBe('12px');
  },
};

export const InvalidIcon: Story = {
  args: {
    name: 'invalid' as any, // We need to cast to 'any' here, for testing purposes
    size: 24,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Check that *no* SVG is rendered.
    const text = canvas.getByText('NoIcon invalid');
    expect(text).toBeInTheDocument();
  },
};
