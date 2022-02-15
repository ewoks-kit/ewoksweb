import { render, screen } from '@testing-library/react';
import App from './App';

test('renders one div element', () => {
  render(<App />);
  const divElements = screen.getAllByRole('div');
  expect(divElements).toHaveLength(1);
});
