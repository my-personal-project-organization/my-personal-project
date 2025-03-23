import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<ButtonComponent> = {
  component: ButtonComponent,
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
