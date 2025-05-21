import { Meta, StoryObj } from '@storybook/angular';
import { expect, within } from '@storybook/test';
import { SideBarComponent } from './side-bar.component';

const meta: Meta<SideBarComponent> = {
  title: 'Shared/UI/Atoms/SideBar',
  component: SideBarComponent,
  argTypes: {
    isOpen: { control: 'boolean' },
    sidebarContent: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<SideBarComponent>;

export const Closed: Story = {
  args: {
    isOpen: false,
    sidebarContent: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByRole('complementary');
    expect(sidebar).toHaveClass('-translate-x-full');
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
    sidebarContent: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByRole('complementary');
    expect(sidebar).toHaveClass('translate-x-0');
  },
};

export const OpenWithContent: Story = {
  render: (args) => ({
    props: {
      isOpen: args.isOpen,
      sidebarContent: args.sidebarContent,
    },
    template: `
      <ui-side-bar [isOpen]="isOpen" [sidebarContent]="sidebarContent">
      </ui-side-bar>
      <ng-template #sidebarContent>
        <div>
            <h3 class="text-lg font-semibold text-gray-800">Sidebar Content</h3>
            <p class="text-sm text-gray-600">This is some content for the sidebar.</p>
            <span class="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">Click Me</span>
        </div>
      </ng-template>
    `,
  }),
  args: {
    isOpen: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByRole('complementary');
    expect(sidebar).toHaveClass('translate-x-0');
    expect(canvas.getByText(/Sidebar Content/gi)).toBeTruthy();
    expect(canvas.getByText(/Click Me/gi)).toBeTruthy();
  },
};
