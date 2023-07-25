import type { WorkflowDescription } from 'types';

import { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { useWorkflows } from '../api/workflows';

interface Props {
  onChange: (input: WorkflowDescription) => void;
  category?: string;
}

function sortByCategory(
  descriptions: WorkflowDescription[]
): Required<WorkflowDescription>[] {
  return descriptions
    .map((desc) => ({
      ...desc,
      category: desc.category || 'NoCategory',
      label: desc.label || '',
    }))
    .sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.label.localeCompare(b.label)
    );
}

// DOC: A dropdown that can be an input as well
function WorkflowDropdown(props: Props) {
  const { onChange, category } = props;

  const [value, setValue] = useState<WorkflowDescription>();
  const [open, setOpen] = useState(false);

  const workflows = useWorkflows();
  const sortedWorkflows = sortByCategory(workflows);

  const options =
    !category || category === 'All'
      ? sortedWorkflows
      : sortedWorkflows.filter((w) => w.category === category);

  return (
    <Autocomplete
      value={value}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderInput={(params) => (
        <TextField
          variant="filled"
          {...params}
          label="Quick open"
          InputProps={{
            ...params.InputProps,
          }}
          inputProps={{ ...params.inputProps, 'aria-label': 'Quick open' }}
        />
      )}
      options={options}
      getOptionSelected={(option, valueSelect) => option.id === valueSelect.id}
      groupBy={(option) => option.category || ''}
      onChange={(event, newValue) => {
        onChange(newValue);

        setTimeout(() => {
          setValue({ id: '', label: '', category: '' });
        }, 200);
      }}
      getOptionLabel={(option) => option.label || ''}
      placeholder="Quick open"
      disableClearable
    />
  );
}

export default WorkflowDropdown;
