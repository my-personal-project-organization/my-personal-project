import { RouterTestingModule } from '@angular/router/testing';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';
import { ButtonComponent, IconComponent } from '../../atoms';
import { SideBarComponent } from '../../atoms/side-bar/side-bar.component';
import { NavBarComponent } from './nav-bar.component';

const meta: Meta<NavBarComponent> = {
  title: 'Components/Molecules/NavBar',
  component: NavBarComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule, ButtonComponent, IconComponent, SideBarComponent],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A navigation bar component that can contain a sidebar and other elements.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<NavBarComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-nav-bar>
        <ng-container>
        </ng-container>
      </ui-nav-bar>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navBar = canvas.getByRole('navigation');
    expect(navBar).toBeTruthy();
  },
};

export const WithExtraButton: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-nav-bar>
        <ng-container>
          <ui-button text="Extra Button" type="button" color="primary"></ui-button>
        </ng-container>
      </ui-nav-bar>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText(/Extra Button/gi);
    expect(button).toBeTruthy();
  },
};

export const WithSideBarContent: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-nav-bar [sidebarContent]="sidebarContent">
        <ng-container>
          <ui-button text="Extra Button" type="button" color="secondary"></ui-button>
        </ng-container>
      </ui-nav-bar>
      <ng-template #sidebarContent>
        <div>
            <h3 class="text-lg font-semibold text-gray-800">Sidebar Content</h3>
            <p class="text-sm text-gray-600">This is some content for the sidebar.</p>
            <span class="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">Click Me</span>
        </div>
      </ng-template>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText(/Extra Button/gi);
    expect(button).toBeTruthy();
  },
};
