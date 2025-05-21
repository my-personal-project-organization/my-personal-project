import type { Meta, StoryObj } from '@storybook/angular';
import { PaginatorComponent } from './paginator.component';

import { expect, within } from '@storybook/test';

const meta: Meta<PaginatorComponent> = {
  component: PaginatorComponent,
  title: 'Shared/UI/Atoms/Paginator',
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
    expect(canvas.getByTestId('paginator-go-previous-page-btn')).toBeTruthy();
    expect(canvas.getByTestId('paginator-go-next-page-btn')).toBeTruthy();
    expect(canvas.getByTestId('paginator-info')).toBeTruthy();
    expect(canvas.getByTestId('paginator-pagination')).toBeTruthy();
    expect(canvas.getByTestId('paginator-go-first-page-btn')).toBeTruthy();
    expect(canvas.getByTestId('paginator-page-size-dropdown')).toBeTruthy();
  },
};

export const WithCurrentPage: Story = {
  args: {
    currentPage: 2,
    pageSize: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByTestId('paginator-go-previous-page-btn')).toBeTruthy();
    expect(canvas.getByTestId('paginator-go-next-page-btn')).toBeTruthy();
    expect(canvas.getByTestId('paginator-info')).toBeTruthy();
    expect(canvas.getByTestId('paginator-info-from')).toHaveTextContent('21');
    expect(canvas.getByTestId('paginator-info-to')).toHaveTextContent('30');
    expect(canvas.getByTestId('paginator-pagination')).toBeTruthy();
    expect(canvas.getByTestId('paginator-pagination-current-page')).toHaveTextContent('3');
    expect(canvas.getByTestId('paginator-go-first-page-btn')).toBeTruthy();
    expect(canvas.getByTestId('paginator-page-size-dropdown')).toBeTruthy();
    expect(canvas.getByTestId('paginator-page-size-dropdown')).toHaveTextContent('10');
  },
};

export const WithPageSize: Story = {
  args: {
    currentPage: 0,
    pageSize: 20,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByTestId('paginator-go-previous-page-btn')).toBeTruthy();
    expect(canvas.getByTestId('paginator-go-next-page-btn')).toBeTruthy();
    expect(canvas.getByTestId('paginator-info')).toBeTruthy();
    expect(canvas.getByTestId('paginator-info-from')).toHaveTextContent('1');
    expect(canvas.getByTestId('paginator-info-to')).toHaveTextContent('20');
    expect(canvas.getByTestId('paginator-pagination')).toBeTruthy();
    expect(canvas.getByTestId('paginator-pagination')).toBeTruthy();
    expect(canvas.getByTestId('paginator-go-first-page-btn')).toBeTruthy();
    expect(canvas.getByTestId('paginator-page-size-dropdown')).toBeTruthy();
    expect(canvas.getByTestId('paginator-page-size-dropdown')).toHaveTextContent('20');
  },
};
