import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { ArgTypes, Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';
import { ToastComponent, ToastTypes } from './toast.component';

// Helper function to generate argTypes
const getArgTypes = (): Partial<ArgTypes<ToastComponent>> => ({
  id: { control: 'text', description: 'Unique identifier (managed by service)' },
  message: { control: 'text', description: 'Main content message' },
  title: { control: 'text', description: 'Optional title' },
  type: {
    control: 'select',
    options: ToastTypes,
    description: 'Type of toast (styling)',
  },
  duration: {
    control: 'number',
    description: 'Auto-dismiss duration (seconds, 0=sticky)',
  },
  closed: { action: 'closed', description: 'Event emitted on close (outputs ID)' },
});

const meta: Meta<ToastComponent> = {
  component: ToastComponent,
  title: 'Shared/UI/Atoms/Toast',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
    }),
  ],
  argTypes: getArgTypes(),
  args: {
    id: 'storybook-toast-1',
    message: 'This is a default toast message.',
    title: '',
    type: 'info',
    duration: 5,
  },
  parameters: {
    notes:
      'This component is typically used via the `ToastService` and rendered within the `ToastContainerComponent`, which handles positioning and stacking. These stories demonstrate the individual component appearance and behavior.',
  },
};
export default meta;
type Story = StoryObj<ToastComponent>;

export const Info: Story = {
  args: {
    id: 'info-toast',
    type: 'info',
    title: 'Information !',
    message: 'Please read the comments carefully.',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Information !/i)).toBeInTheDocument();
    await expect(canvas.getByText(/Please read the comments carefully./i)).toBeInTheDocument();
    const closeButton = canvas.getByLabelText('Close');
    await userEvent.click(closeButton);
  },
};

export const Success: Story = {
  args: {
    id: 'success-toast',
    type: 'success',
    title: 'Success !',
    message: 'Your action was completed successfully.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Success !/i)).toBeInTheDocument();
    await expect(canvas.getByText(/Your action was completed successfully./i)).toBeInTheDocument();
  },
};

export const Warning: Story = {
  args: {
    id: 'warning-toast',
    type: 'warning',
    title: 'Warning !',
    message: 'There was a problem with your network connection.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Warning !/i)).toBeInTheDocument();
    await expect(canvas.getByText(/There was a problem with your network connection./i)).toBeInTheDocument();
  },
};

export const Error: Story = {
  args: {
    id: 'error-toast',
    type: 'error',
    title: 'Error !',
    message: 'A problem has occurred while submitting your data.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Error !/i)).toBeInTheDocument();
    await expect(canvas.getByText(/A problem has occurred while submitting your data./i)).toBeInTheDocument();
  },
};

export const NoTitle: Story = {
  args: {
    id: 'no-title-toast',
    type: 'info',
    title: undefined,
    message: 'This toast does not have a title.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/This toast does not have a title./i)).toBeInTheDocument();
    const titleElement = canvasElement.querySelector('strong');
    expect(titleElement).toBeNull();
  },
};

export const Sticky: Story = {
  args: {
    id: 'sticky-toast',
    type: 'warning',
    title: 'Sticky Toast',
    message: 'This toast will not close automatically (duration 0).',
    duration: 0,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Sticky Toast/i)).toBeInTheDocument();
    const closeButton = canvas.getByLabelText('Close');
    await userEvent.click(closeButton);
  },
};
