import type { Meta, StoryObj } from '@storybook/angular';
import { DialogComponent } from './dialog.component';

import { expect, within } from '@storybook/test';

const meta: Meta<DialogComponent> = {
  component: DialogComponent,
  title: 'Shared/UI/Atoms/Dialog',
  argTypes: {
    title: { control: 'text' },
    confirmButtonText: { control: 'text' },
    cancelButtonText: { control: 'text' },
    cancelButtonDisabled: { control: 'boolean' },
    hideCancelButton: { control: 'boolean' },
    confirmButtonDisabled: { control: 'boolean' },
    isOpen: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<DialogComponent>;

export const Default: Story = {
  args: {
    title: 'Dialog Title',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    cancelButtonDisabled: false,
    hideCancelButton: false,
    confirmButtonDisabled: false,
    isOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Dialog Title/gi)).toBeTruthy();
    expect(canvas.getByText(/Confirm/gi)).toBeTruthy();
    expect(canvas.getByText(/Cancel/gi)).toBeTruthy();
  },
};

export const WithCustomButtons: Story = {
  args: {
    title: 'Dialog Title',
    confirmButtonText: 'Save Changes',
    cancelButtonText: 'Discard Changes',
    cancelButtonDisabled: false,
    hideCancelButton: false,
    confirmButtonDisabled: false,
    isOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Dialog Title/gi)).toBeTruthy();
    expect(canvas.getByText(/Save Changes/gi)).toBeTruthy();
    expect(canvas.getByText(/Discard Changes/gi)).toBeTruthy();
  },
};

export const WithDisabledButtons: Story = {
  args: {
    title: 'Dialog Title',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    cancelButtonDisabled: true,
    hideCancelButton: false,
    confirmButtonDisabled: true,
    isOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Dialog Title/gi)).toBeTruthy();
    expect(canvas.getByText(/Confirm/gi)).toBeTruthy();
    expect(canvas.getByText(/Cancel/gi)).toBeTruthy();
  },
};

export const WithHiddenCancelButton: Story = {
  args: {
    title: 'Dialog Title',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    cancelButtonDisabled: false,
    hideCancelButton: true,
    confirmButtonDisabled: false,
    isOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Dialog Title/gi)).toBeTruthy();
    expect(canvas.getByText(/Confirm/gi)).toBeTruthy();
    expect(canvas.queryByText(/Cancel/gi)).toBeNull();
  },
};
