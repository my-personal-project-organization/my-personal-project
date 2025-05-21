import { provideHttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockAuthService, provideMockFirebaseConfig } from '@mpp/shared/data-access';
import { clickOnBtnDataTestId } from '@mpp/shared/ui';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { expect, within } from '@storybook/test';
import { LandingComponent } from './landing.component';

const meta: Meta<LandingComponent> = {
  title: 'Scribo/FeatureLanding/Landing',
  component: LandingComponent,
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
type Story = StoryObj<LandingComponent>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify heading and description', async () => {
      expect(canvas.getByTestId('landing-welcome-title')).toBeInTheDocument();
      expect(canvas.getByTestId('landing-welcome-description')).toBeInTheDocument();
      expect(canvas.getAllByTestId('landing-feature-card')).toHaveLength(6);
      await clickOnBtnDataTestId(canvas, 'landing-get-started-button');
    });
  },
};

export const WithCustomFeatures: Story = {
  args: {
    features: [
      {
        title: 'Custom Feature 1',
        description: 'Description for custom feature 1',
        image: 'https://via.placeholder.com/150',
      },
      {
        title: 'Custom Feature 2',
        description: 'Description for custom feature 2',
        image: 'https://via.placeholder.com/150',
      },
    ],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify custom features are displayed', async () => {
      expect(canvas.getAllByTestId('landing-feature-card')).toHaveLength(2);
    });
  },
};
