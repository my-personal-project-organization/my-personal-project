import { Component, inject } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import type { ArgTypes, Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { expect } from '@storybook/jest';
import { screen, userEvent, waitFor, within } from '@storybook/testing-library';
import { ToastComponent, ToastTypes } from './toast.component';

import { ButtonComponent } from '../button/button.component';
import { ToastContainerComponent } from './toast-container/toast-container.component';
import { ToastService } from './toast.service';

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
    applicationConfig({
      providers: [ToastService, provideAnimations()],
    }),
    moduleMetadata({
      imports: [ToastContainerComponent, ButtonComponent],
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
    const closeButton = canvas.getByLabelText('Close');
    await userEvent.click(closeButton);
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
    const closeButton = canvas.getByLabelText('Close');
    await userEvent.click(closeButton);
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

@Component({
  selector: 'ui-dynamic-toast-demo',
  standalone: true,
  imports: [ButtonComponent, ToastContainerComponent],
  template: `
    <div>
      <h3 class="mb-4 text-lg font-semibold">Trigger Toasts via Service</h3>
      <div class="flex flex-wrap gap-4">
        <ui-button type="button" text="Show Info" color="info" (btnClick)="showInfo()"></ui-button>
        <ui-button type="button" text="Show Success" color="success" (btnClick)="showSuccess()"></ui-button>
        <ui-button type="button" text="Show Warning" color="warning" (btnClick)="showWarning()"></ui-button>
        <ui-button type="button" text="Show Error" color="danger" (btnClick)="showError()"></ui-button>
      </div>
      <!-- Container must be present to display toasts -->
      <ui-toast-container></ui-toast-container>
    </div>
  `,
})
class DynamicToastDemoComponent {
  private readonly toastService = inject(ToastService);

  showInfo() {
    this.toastService.info('This is an info message.', 'Info Title');
  }
  showSuccess() {
    this.toastService.success(
      'Operation completed successfully! This story demonstrates creating toasts dynamically using the `ToastService`. Click the buttons to trigger different toast types. The `ToastContainerComponent` (inside the demo component) is responsible for rendering the toasts.',
      'Success Title',
    );
  }
  showWarning() {
    this.toastService.warning('Please check your input.', 'Warning Title', 10);
  }
  showError() {
    this.toastService.error('An unexpected error occurred.', 'Error Title');
  }
}

export const DynamicToastsViaService: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [DynamicToastDemoComponent],
    },
    template: `<ui-dynamic-toast-demo></ui-dynamic-toast-demo>`,
  }),
  parameters: {
    controls: { disable: true },
    notes:
      'This story demonstrates creating toasts dynamically using the `ToastService`. Click the buttons to trigger different toast types. The `ToastContainerComponent` (inside the demo component) is responsible for rendering the toasts.',
  },
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const infoButton = canvas.getByRole('button', { name: /show info/i });
    await userEvent.click(infoButton);
    await expect(screen.findByText(/Info Title/i)).resolves.toBeInTheDocument();
    await expect(screen.findByText(/This is an info message./i)).resolves.toBeInTheDocument();

    const successButton = canvas.getByRole('button', { name: /show success/i });
    await userEvent.click(successButton);
    await expect(screen.findByText(/Success Title/i)).resolves.toBeInTheDocument();
    await expect(screen.findByText(/Operation completed successfully!/i)).resolves.toBeInTheDocument();

    const warningButton = canvas.getByRole('button', { name: /show warning/i });
    await userEvent.click(warningButton);
    await expect(screen.findByText(/Warning Title/i)).resolves.toBeInTheDocument();
    await expect(screen.findByText(/Please check your input./i)).resolves.toBeInTheDocument();

    const errorButton = canvas.getByRole('button', { name: /show error/i });
    await userEvent.click(errorButton);

    const errorToastMessage = await screen.findByText(/An unexpected error occurred./i);
    expect(errorToastMessage).toBeInTheDocument();

    await expect(screen.findByText(/Error Title/i)).resolves.toBeInTheDocument();

    const allToasts = await screen.findAllByRole('alert');

    const lastToast = allToasts[allToasts.length - 1];

    const closeErrorButton = within(lastToast).getByLabelText('Close');
    await userEvent.click(closeErrorButton);

    await waitFor(() => expect(screen.queryByText(/An unexpected error occurred./i)).not.toBeInTheDocument());

    await waitFor(() => expect(screen.queryByText(/Error Title/i)).not.toBeInTheDocument());
  },
};
