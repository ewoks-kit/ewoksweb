import { act, fireEvent, render, screen } from '@testing-library/react';
import Conditions from './Conditions';
import state from '../store/state';

describe('In the AddNodes test:', () => {
  test('initially it renders one button element named ¨Add Nodes¨', async () => {
    render(<Conditions props />);
    const buttonAddNodes = screen.getByRole('button');
    expect(buttonAddNodes).toBeInTheDocument();
  });
});

// if addConditions is pressed on a selected link
// a new line is added in conditions or not if last line empty

// a conditionsValuesChanged changes the selected link conditions

// editableTable not in the document if no conditions in the selectedElement
// an has number of lines as the number of conditions
