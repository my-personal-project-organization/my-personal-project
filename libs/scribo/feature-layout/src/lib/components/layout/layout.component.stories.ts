import { provideHttpClient } from '@angular/common/http';
import { waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockAuthService, provideMockFirebaseConfig } from '@mpp/shared/data-access';
import { clickOnBtnDataTestId } from '@mpp/shared/ui';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';
import { ScriboFeatureLayoutComponent } from './layout.component';

// TODO: Uncomment the following lines to enable routing in the story. NOT WORKING
// @Component({
//   selector: 'scrb-layout-landing',
//   template: '<p>Mock Landing Page Content</p>',
// })
// class MockLandingComponent {}

// @Component({
//   selector: 'scrb-layout-articles',
//   template: '<p>Mock Articles Page Content</p>',
// })
// class MockArticlesComponent {}

// @Component({
//   selector: 'scrb-layout-profile',
//   template: '<p>Mock Profile Page Content</p>',
// })
// class MockProfileComponent {}

const meta: Meta<ScriboFeatureLayoutComponent> = {
  title: 'Scribo/FeatureLayout/Layout',
  component: ScriboFeatureLayoutComponent,
  decorators: [
    applicationConfig({
      providers: [provideHttpClient(), provideMockFirebaseConfig(), provideMockAuthService()],
    }),
    moduleMetadata({
      imports: [RouterTestingModule],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<ScriboFeatureLayoutComponent>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
    <scrb-layout>
        <router-outlet></router-outlet>
    </scrb-layout>
  `,
    // TODO: Uncomment the following lines to enable routing in the story. NOT WORKING
    // moduleMetadata: {
    //   imports: [
    //     RouterTestingModule.withRoutes([
    //       { path: 'landing', component: MockLandingComponent },
    //       { path: 'list', component: MockArticlesComponent },
    //       { path: 'user-profile', component: MockProfileComponent },
    //       { path: '', redirectTo: 'landing', pathMatch: 'full' },
    //     ]),
    //   ],
    //   declarations: [MockLandingComponent, MockArticlesComponent, MockProfileComponent],
    // },
  }),

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    // TODO: Not working
    // extendCanvasWithUtilities(canvas);

    await step('Verify layout structure', async () => {
      const nav = canvas.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      const footer = canvas.getByRole('contentinfo'); // Use contentinfo for footer
      expect(footer).toBeInTheDocument();
    });

    await step('Verify navbar content', async () => {
      const homeLink = canvas.getByTestId('sidebar-home-link');
      expect(homeLink).toBeInTheDocument();
      const navBarBtn = canvas.getByTestId('nav-bar-toggle-button');
      expect(navBarBtn).toBeInTheDocument();
      const logoLink = canvas.getByTestId('nav-bar-logo');
      expect(logoLink).toBeInTheDocument();
    });

    await step('Verify footer content', async () => {
      const profileLink = canvas.getByRole('link', { name: /My Profile/i });
      expect(profileLink).toBeInTheDocument();
      expect(profileLink).toHaveAttribute('href', '/scribo/user-profile');

      const githubLink = canvas.getByRole('link', { name: /Visit my GitHub profile/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/mario1velasco');
      expect(githubLink).toHaveAttribute('target', '_blank');

      const linkedinLink = canvas.getByRole('link', { name: /Visit my LinkedIn profile/i });
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/mariovelascoalonso/');
      expect(linkedinLink).toHaveAttribute('target', '_blank');

      const emailLink = canvas.getByRole('link', { name: /Send me an email/i });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', 'mailto:mario1velasco@gmail.com');

      const currentYear = new Date().getFullYear();
      expect(canvas.getByText(new RegExp(`© ${currentYear} Mario Velasco`))).toBeInTheDocument();
    });

    await step('Verify login and logout functionality', async () => {
      await clickOnBtnDataTestId(canvas, 'nav-bar-toggle-button');
      await clickOnBtnDataTestId(canvas, 'sidebar-login-button');
      const articlesLink = canvas.getByTestId('sidebar-articles-link');
      expect(articlesLink).toBeInTheDocument();

      const profileLink = canvas.getByTestId('sidebar-profile-link');
      expect(profileLink).toBeInTheDocument();

      await clickOnBtnDataTestId(canvas, 'sidebar-logout-button');
      expect(canvas.queryByTestId('nav-profile-link')).not.toBeInTheDocument();

      await clickOnBtnDataTestId(canvas, 'nav-bar-toggle-button');
      expect(canvas.queryByTestId('sidebar-home-link')).not.toBeInTheDocument();
    });
  },
};
