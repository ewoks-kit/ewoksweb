import {
  findByDisplayValue,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import AddNodes from './AddNodes';

test('renders one button element named ¨Add Nodes¨', async () => {
  render(<AddNodes />);
  const buttonElement = screen.getByRole('button');
  // console.log(buttonElements);
  expect(buttonElement).toBeInTheDocument();

  const addNodeButton = screen.getByRole('button', {
    // eslint-disable-next-line require-unicode-regexp
    name: /add nodes/i,
  });
  expect(addNodeButton).toBeInTheDocument();

  fireEvent(
    buttonElement,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );

  // const tooltipText = await screen.findByDisplayValue('ewokscore');
  const ewoksCoreCategory = screen.getByRole('button', {
    // eslint-disable-next-line require-unicode-regexp
    name: /est/i,
  });
  expect(ewoksCoreCategory).toBeInTheDocument();

  const buttonElementsOpenedCategories = screen.getAllByRole('button');
  // console.log(buttonElementsOpenedCategories);
  expect(buttonElementsOpenedCategories).toHaveLength(3);

  fireEvent(
    buttonElementsOpenedCategories[0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );

  // fireEvent(
  //   buttonElement,
  //   new MouseEvent('mouseover', {
  //     bubbles: true,
  //     cancelable: true,
  //   })
  // );
  // const tooltipText = await screen.findByDisplayValue('Est');

  // expect(tooltipText).toBeInTheDocument();
});
