import type { WorkflowDescription } from 'types';

import useStore from 'store/useStore';
import { useState } from 'react';
import { FetchStatus } from './models';
import { Autocomplete } from '@material-ui/lab';
import { CircularProgress, TextField } from '@material-ui/core';
import { textForError } from '../../utils';
import { getWorkflows } from './utils';
import commonStrings from 'commonStrings.json';
import axios from 'axios';

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
  const [value, setValue] = useState<WorkflowDescription>({
    id: '',
    label: '',
    category: '',
  });
  const [fetchStatus, setFetchStatusOpen] = useState(FetchStatus.ToDo);
  const loading = fetchStatus === FetchStatus.Pending;
  const setAllWorkflows = useStore((state) => state.setAllWorkflows);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  async function onOpenDropdown() {
    setFetchStatusOpen(FetchStatus.Pending);
    try {
      const workflows = await getWorkflows();
      setAllWorkflows(workflows);
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: axios.isAxiosError(error)
          ? 'Something went wrong when contacting the server!'
          : textForError(error, commonStrings.retrieveWorkflowsError),
        severity: 'error',
      });
    } finally {
      setFetchStatusOpen(FetchStatus.Done);
    }
  }

  const workflows = useStore((state) => state.allWorkflows);

  const { onChange, category } = props;

  const sortedWorkflows = sortByCategory(workflows);

  const options =
    !category || category === 'All'
      ? sortedWorkflows
      : sortedWorkflows.filter((w) => w.category === category);

  return (
    <Autocomplete
      value={value}
      data-testid="async-autocomplete-drop"
      open={fetchStatus !== FetchStatus.ToDo}
      onOpen={() => {
        onOpenDropdown();
      }}
      onClose={() => {
        setFetchStatusOpen(FetchStatus.ToDo);
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          variant="filled"
          {...params}
          label="Quick open"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
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
