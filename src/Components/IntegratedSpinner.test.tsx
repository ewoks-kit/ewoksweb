import { fireEvent, render, screen } from '@testing-library/react';
import IntegratedSpinner from './IntegratedSpinner';

test('renders one button element', () => {
  render(
    <IntegratedSpinner
      tooltip="testing tooltip"
      action={console.log('testing')}
      getting={false}
    >
      <div>testing</div>
    </IntegratedSpinner>
  );
  const buttonElements = screen.getAllByRole('button');
  expect(buttonElements).toHaveLength(1);
  fireEvent(
    buttonElements[0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );
});
