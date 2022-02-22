import {
  findByDisplayValue,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import AddNodes from './AddNodes';

test('renders one button element', async () => {
  render(<AddNodes />);
  const buttonElements = screen.getAllByRole('button');
  expect(buttonElements).toHaveLength(1);

  fireEvent(
    buttonElements[0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );

  const buttonElementsOpenedCategories = screen.getAllByRole('button');
  //console.log(buttonElementsOpenedCategories);
  expect(buttonElementsOpenedCategories).toHaveLength(3);

  fireEvent(
    buttonElementsOpenedCategories[0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );

  const buttonElementsOpenedCategoriesClick0 = screen.getAllByRole('button');
  //console.log(buttonElementsOpenedCategoriesClick0);
  expect(buttonElementsOpenedCategoriesClick0).toHaveLength(3);

  fireEvent(
    buttonElementsOpenedCategoriesClick0[0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );

  const buttonElementsOpenedCategoriesClick1 = screen.getAllByRole('button');
  //console.log(buttonElementsOpenedCategoriesClick1);
  expect(buttonElementsOpenedCategoriesClick1).toHaveLength(3);

  // fireEvent(
  //   buttonElements[0],
  //   new MouseEvent('mouseover', {
  //     bubbles: true,
  //     cancelable: true,
  //   })
  // );
  const tooltipText = await screen.findByDisplayValue('Est');

  expect(tooltipText).toBeInTheDocument();
});
