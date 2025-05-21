import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

import { expect, within } from '@storybook/test';
import { IconComponent } from '../icon';

const meta: Meta<ButtonComponent> = {
  component: ButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [IconComponent],
    }),
  ],
  title: 'Shared/UI/Atoms/Button',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    text: { control: 'text' },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    color: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: {
    text: 'Button',
    type: 'button',
    color: 'primary',
    size: 'medium',
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Button/gi)).toBeTruthy();
  },
};

export const Secondary: Story = {
  args: {
    text: 'Button',
    type: 'button',
    color: 'secondary',
    size: 'medium',
    disabled: false,
  },
  render: (args) => ({
    props: {
      ...args,
      ngModel: null,
    },
    template: `
        <div style="background-color: black; padding: 30px;">
            <ui-button
              [text]="text"
              [type]="type"
              [color]="color"
              [size]="size"
              [disabled]="disabled"
            />
        </div>
      `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Button/gi)).toBeTruthy();
  },
};

export const Danger: Story = {
  args: {
    text: 'Button',
    type: 'button',
    color: 'danger',
    size: 'medium',
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Button/gi)).toBeTruthy();
  },
};

export const Small: Story = {
  args: {
    text: 'Button',
    type: 'button',
    color: 'primary',
    size: 'small',
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Button/gi)).toBeTruthy();
  },
};

export const Medium: Story = {
  args: {
    text: 'Button',
    type: 'button',
    color: 'primary',
    size: 'medium',
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Button/gi)).toBeTruthy();
  },
};

export const Large: Story = {
  args: {
    text: 'Button',
    type: 'button',
    color: 'primary',
    size: 'large',
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Button/gi)).toBeTruthy();
  },
};

export const Disabled: Story = {
  args: {
    text: 'Button',
    type: 'button',
    color: 'primary',
    size: 'medium',
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Button/gi)).toBeTruthy();
  },
};

export const WithIcon: Story = {
  render: (args) => ({
    props: {
      text: args.text,
      type: args.type,
      color: args.color,
      size: args.size,
      disabled: args.disabled,
    },
    template: `
    <ui-button [text]="text" [type]="type" [color]="color" [size]="size" [disabled]="disabled">
      <ui-icon name="calendar"></ui-icon>
    </ui-button>
  `,
  }),
  args: {
    text: 'Click Me',
    type: 'button',
    color: 'primary',
    size: 'medium',
    disabled: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    expect(button).toBeTruthy();
    expect(canvas.getByText(/Click Me/gi)).toBeTruthy();
    const svg = canvas.getByTestId('calendar');
    expect(svg).toBeInTheDocument();
  },
};
