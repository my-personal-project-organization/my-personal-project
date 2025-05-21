// libs/scribo/feature-layout/src/lib/components/footer/footer.component.stories.ts
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing'; // <-- Import
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { expect, within } from '@storybook/test';
import { FooterComponent } from './footer.component';

const meta: Meta<FooterComponent> = {
  title: 'Scribo/FeatureLayout/Footer',
  component: FooterComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, RouterTestingModule],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;
type Story = StoryObj<FooterComponent>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify static text content', async () => {
      expect(canvas.getByText(/Scribo/i)).toBeInTheDocument();
      expect(canvas.getByText(/Your platform to share your stories/i)).toBeInTheDocument();
      expect(canvas.getByText(/Created by Mario Velasco/i)).toBeInTheDocument();
      const currentYear = new Date().getFullYear();
      expect(canvas.getByText(`© ${currentYear} Mario Velasco. All rights reserved.`)).toBeInTheDocument();
    });

    await step('Verify internal link', async () => {
      const profileLink = canvas.getByRole('link', { name: /My Profile/i });
      expect(profileLink).toBeInTheDocument();
      expect(profileLink).toHaveAttribute('href', '/scribo/user-profile');
    });

    await step('Verify external icon links', async () => {
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
    });
  },
};
