import { expect, within } from '@storybook/test';

/**
 * Utility function to find an element by data-testid and click it.
 * @param canvas - The canvas object from Storybook.
 * @param testId - The data-testid of the element to find and click.
 */
export async function clickOnBtnDataTestId(canvas: any, testId: string) {
  const element = await canvas.findByTestId(testId);
  expect(element).toBeInTheDocument();
  element.scrollIntoView();
  const button = within(element).getByRole('button');
  await button.click();
}

/**
 * Extend the canvas object with custom methods.
 * @param canvas - The canvas object from Storybook.
 */
export function extendCanvasWithUtilities(canvas: any) {
  canvas.clickOnBtnDataTestId = (testId: string) => clickOnBtnDataTestId(canvas, testId);
}
