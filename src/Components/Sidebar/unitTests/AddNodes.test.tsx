import { act, fireEvent, render, screen } from '@testing-library/react';
import type { Matcher } from '@testing-library/react';
import AddNodes from '../AddNodes';
import useStore from 'store/useStore';

describe('In the AddNodes test:', () => {
  test('initially it renders one button element named ¨Add Nodes¨', async () => {
    render(<AddNodes title="Add Nodes" />);
    const buttonAddNodes = screen.getByRole('button', { name: /Add Nodes/u });
    expect(buttonAddNodes).toBeInTheDocument();
  });

  test('if AddNodes is clicked it reveals the initial category EwoksCore', async () => {
    render(<AddNodes title="Add Nodes" />);
    const buttonAddNodes = screen.getByRole('button', { name: /Add Nodes/u });

    fireEvent(
      buttonAddNodes,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    const ewoksCoreCategory = screen.getByRole('button', {
      name: /EwoksCore/u,
    });
    expect(ewoksCoreCategory).toBeInTheDocument();

    const { tasks } = useStore.getState();
    const taskCategories = [...new Set(tasks.map((m) => m.category)).values()];
    expect(taskCategories).toHaveLength(1);
    expect(taskCategories).toEqual(expect.arrayContaining(['EwoksCore']));

    const buttonAddNodesOpenedCategories = screen.getAllByRole('button');
    expect(buttonAddNodesOpenedCategories).toHaveLength(2);
  });

  test('if categories change and AddNodes is clicked it reveals the new categories', async () => {
    render(<AddNodes title="Add Nodes" />);
    const buttonAddNodes = screen.getByRole('button', { name: /Add Nodes/u });

    act(() => {
      useStore.setState({
        tasks: [
          { task_identifier: 'task1', task_type: 'class', category: 'est' },
          { task_identifier: 'task1', task_type: 'class', category: 'dusk' },
        ],
      });
    });

    fireEvent(
      buttonAddNodes,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    const ewoksCoreCategory = screen.getByRole('button', {
      name: /est/u,
    });
    expect(ewoksCoreCategory).toBeInTheDocument();

    const { tasks } = useStore.getState();
    const taskCategories = [...new Set(tasks.map((m) => m.category)).values()];
    expect(taskCategories).toHaveLength(2);
    expect(taskCategories).toEqual(expect.arrayContaining(['est', 'dusk']));

    const buttonAddNodesOpenedCategories = screen.getAllByRole('button');
    expect(buttonAddNodesOpenedCategories).toHaveLength(3);
  });

  test('if tasks added and category is clicked it reveals them', async () => {
    render(<AddNodes title="Add Nodes" />);
    const buttonAddNodes = screen.getByRole('button', { name: /Add Nodes/u });

    act(() => {
      useStore.setState({
        tasks: [
          {
            task_identifier: 'taskSkeleton',
            task_type: 'ppfmethod',
            icon: 'orange1',
            category: 'ewokscore',
            optional_input_names: [],
            output_names: [],
            required_input_names: [],
          },
        ],
      });
    });

    fireEvent(
      buttonAddNodes,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
    const { tasks } = useStore.getState();
    const taskName: string = tasks[0].task_identifier || '';

    const ewoksCoreCategory = screen.getByRole('button', {
      name: /ewokscore/u,
    });

    fireEvent(
      ewoksCoreCategory,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    const ewoksCoreTask = screen.getByTitle(taskName as Matcher);
    expect(ewoksCoreTask).toBeVisible();

    fireEvent(
      ewoksCoreCategory,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    // TODO: Although category was clicked again the task remains visible?
    // expect(ewoksCoreTask).not.toBeVisible();

    const taskCategories = [...new Set(tasks.map((m) => m.category)).values()];
    expect(taskCategories).toHaveLength(1);
    expect(taskCategories).toEqual(expect.arrayContaining(['ewokscore']));

    const buttonAddNodesOpenedCategories = screen.getAllByRole('button');

    expect(buttonAddNodesOpenedCategories).toHaveLength(2);
  });

  test('if insertGraph is pressed setGraphOrSubgraph is set to false on state', async () => {
    render(<AddNodes title="Add Nodes" />);
    const buttonAddNodes = screen.getByRole('button', { name: /Add Nodes/u });

    act(() => {
      useStore.setState({
        graphOrSubgraph: true,
        tasks: [
          {
            task_identifier: 'taskSkeleton',
            task_type: 'ppfmethod',
            icon: 'orange1',
            category: 'General',
            optional_input_names: [],
            output_names: [],
            required_input_names: [],
          },
        ],
      });
    });

    fireEvent(
      buttonAddNodes,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    const GeneralCategory = screen.getByRole('button', {
      name: /General/u,
    });
    expect(GeneralCategory).toBeInTheDocument();

    fireEvent(
      GeneralCategory,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    const { tasks } = useStore.getState();
    const taskCategories = [...new Set(tasks.map((m) => m.category)).values()];
    expect(taskCategories).toHaveLength(1);
    expect(taskCategories).toEqual(expect.arrayContaining(['General']));

    const buttonAddNodesOpenedCategories = screen.getAllByRole('button');
    expect(buttonAddNodesOpenedCategories).toHaveLength(5);

    const addSubgraphButton = screen.getByTestId('addSubgraphFromDisk');

    expect(addSubgraphButton).toBeInTheDocument();
    expect(addSubgraphButton).toBeVisible();

    fireEvent(
      addSubgraphButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(useStore.getState().graphOrSubgraph).toBe(false);

    fireEvent(
      GeneralCategory,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(addSubgraphButton).toBeInTheDocument();
    expect(addSubgraphButton).not.toBeVisible();
  });
});
