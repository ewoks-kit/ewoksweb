import { render, screen } from '@testing-library/react';
import GetFromServer from './GetFromServer';

test('renders 4 buttons', () => {
  render(<GetFromServer />);

  const buttonElements = screen.getAllByRole('button');
  console.log(buttonElements);

  expect(buttonElements).toHaveLength(4);
});
