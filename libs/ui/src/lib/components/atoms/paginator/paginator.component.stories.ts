import type { Meta, StoryObj } from '@storybook/angular';
import { PaginatorComponent } from './paginator.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<PaginatorComponent> = {
  component: PaginatorComponent,
  title: 'PaginatorComponent',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    currentPage: { control: 'number' },
    pageSize: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<PaginatorComponent>;

export const Default: Story = {
  args: {
    currentPage: 0,
    pageSize: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Showing 1 to 10/gi)).toBeTruthy();
    expect(canvas.getByText(/Page size/gi)).toBeTruthy();
  },
};

export const WithCurrentPage: Story = {
  args: {
    currentPage: 2,
    pageSize: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Showing 21 to 30/gi)).toBeTruthy();
    expect(canvas.getByText(/Page size/gi)).toBeTruthy();
  },
};

export const WithPageSize: Story = {
  args: {
    currentPage: 0,
    pageSize: 20,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Showing 1 to 20/gi)).toBeTruthy();
    expect(canvas.getByText(/Page size/gi)).toBeTruthy();
  },
};
