import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular-vite';
import { expect, waitFor, within } from 'storybook/test';
import { DropdownComponent } from './dropdown.component';

const meta: Meta<DropdownComponent> = {
  component: DropdownComponent,
  title: 'Shared/UI/Atoms/Dropdown',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    options: { control: 'select' },
    placeholder: { control: 'text' },
  },
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, FormsModule],
    }),
  ],
};
export default meta;
type Story = StoryObj<DropdownComponent>;

export const Default: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    placeholder: 'Select an option',
  },
  render: (args) => ({
    props: {
      ...args,
      ngModel: null,
    },
    template: `
        <form (ngSubmit)="onSubmit()">
          <ui-dropdown
            [(ngModel)]="ngModel"
            name="myDropdown"
            [options]="options"
            [placeholder]="placeholder"
          />
        </form>
      `,
  }),
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
  },
  render: (args) => ({
    props: {
      ...args,
      formControl: new FormControl<string>('Option 2'),
    },
    template: `
        <form (ngSubmit)="onSubmit()">
          <ui-dropdown
            [formControl]="formControl"
            name="myDropdown"
            [options]="options"
            [placeholder]="placeholder"
          />
        </form>
      `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Option 2/gi)).toBeTruthy();
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
  },
  render: (args) => ({
    props: {
      ...args,
      ngModel: null,
    },
    template: `
        <form (ngSubmit)="onSubmit()">
          <ui-dropdown
            [(ngModel)]="ngModel"
            name="myDropdown"
            [options]="options"
            [placeholder]="placeholder"
          />
        </form>
      `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Choose an option/gi)).toBeTruthy();
    const button = canvas.getByTestId('dropdown-button');
    expect(button).toBeTruthy();
    button.click();
    // Wait for menu items to appear after clicking
    await waitFor(() => {
      expect(canvas.getAllByTestId('dropdown-menu-item')).toHaveLength(3);
    });
    canvas.getAllByTestId('dropdown-menu-item')?.[2]?.click();
    // Wait for option to be selected
    await waitFor(() => {
      expect(canvas.getByText(/Option 3/gi)).toBeTruthy();
    });
    expect(canvas.getByRole('button')).toBeTruthy();
  },
};
