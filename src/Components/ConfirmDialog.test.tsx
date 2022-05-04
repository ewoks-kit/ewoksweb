// TO TEST
// open when open====true
// not open when open===false
// closes when "No", "Yes" or X is pressed
// title and content is correctly displayed
// callbacks agreeCallback and disagreeCallback are called correctly on "Yes" and "No"

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ConfirmDialog from './ConfirmDialog';
// import state from '../store/state';

describe('In the ConfirmDialog:', () => {
  test('Initially not to be visible if open===false', async () => {
    const openAgreeDialog = jest.fn();
    const agreeDeleteTask = jest.fn();
    const disAgreeDeleteTask = jest.fn();

    render(
      <ConfirmDialog
        title={`Delete task?`}
        content={`You are about to delete a task.
            Please make sure that it is not used in any workflow!
            Do you agree to continue?`}
        open={false}
        agreeCallback={agreeDeleteTask}
        disagreeCallback={disAgreeDeleteTask}
      />
    );

    const dialog1 = screen.queryByRole('dialog');
    expect(dialog1).not.toBeInTheDocument();
  });

  test('To be visible if open===true', async () => {
    const openAgreeDialog = jest.fn();
    const agreeDeleteTask = jest.fn();
    const disAgreeDeleteTask = jest.fn();

    render(
      <ConfirmDialog
        title={`Delete task?`}
        content={`You are about to delete a task.
            Please make sure that it is not used in any workflow!
            Do you agree to continue?`}
        open={true}
        agreeCallback={agreeDeleteTask}
        disagreeCallback={disAgreeDeleteTask}
      />
    );

    const dialog = screen.queryByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });
});
