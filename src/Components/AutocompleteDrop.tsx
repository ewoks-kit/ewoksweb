import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getWorkflows } from '../utils';
import useStore from '../store';

function AutocompleteDrop(props) {
  const [options, setOptions] = useState([]);
  const [value] = React.useState(options[0]);
  const [open, setOpen] = useState(false);
  const setAllWorkflows = useStore((state) => state.setAllWorkflows);
  const loading = open && options.length === 0;
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const setInputValue = (newInputValue) => {
    props.setInputValue(newInputValue);
  };

  const temp = async () => {
    setOpen(true);
    let active = true;
    const workF: { title: string }[] = await getWorkflows();
    if (workF && workF.length > 0) {
      setAllWorkflows(workF);
      if (active) {
        setOptions([...workF]);
      }
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Something went wrong when contacting the server!',
        severity: 'error',
      });
    }
    return () => {
      active = false;
    };
  };

  return (
    <Autocomplete
      id="async-autocomplete-drop"
      open={open}
      onOpen={() => {
        temp();
        // setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      // isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.title}
      options={options}
      loading={loading}
      value={value}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Workflows"
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
    />
  );
}

export default AutocompleteDrop;
