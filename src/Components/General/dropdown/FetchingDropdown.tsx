import { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import type { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import useStore from 'store/useStore';
import { FetchStatus } from './models';
import { fetchWorkflows } from './utils';

// DOC: A dropdown that fetches workflow descriptions on opening
function FetchingDropdown<T, D extends boolean>(
  props: Omit<AutocompleteProps<T, false, D, false>, 'renderInput'>
) {
  const [fetchStatus, setFetchStatusOpen] = useState(FetchStatus.ToDo);
  const loading = fetchStatus === FetchStatus.Pending;
  const setAllWorkflows = useStore((state) => state.setAllWorkflows);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const inExecutionMode = useStore((state) => state.inExecutionMode);

  async function onOpenDropdown() {
    setFetchStatusOpen(FetchStatus.Pending);
    const { workflows, error } = await fetchWorkflows();
    setFetchStatusOpen(FetchStatus.Done);
    setAllWorkflows(workflows);
    if (error) {
      setOpenSnackbar({ open: true, text: error, severity: 'error' });
    }
  }

  return (
    <Autocomplete
      disabled={inExecutionMode}
      data-testid="async-autocomplete-drop"
      open={fetchStatus !== FetchStatus.ToDo}
      onOpen={() => onOpenDropdown()}
      onClose={() => {
        setFetchStatusOpen(FetchStatus.ToDo);
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          variant="filled"
          {...params}
          label={props.placeholder}
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
        />
      )}
      {...props}
    />
  );
}

export default FetchingDropdown;
