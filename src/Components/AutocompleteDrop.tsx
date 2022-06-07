import { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getWorkflows } from '../utils';

import state from '../store/state';

function AutocompleteDrop(props) {
  const [options, setOptions] = useState([]);
  const [value] = useState(options[0]);
  // options[0].slice(-5) === '.json' ? options[0].slice(0, -5) : options[0]
  const [open, setOpen] = useState(false);
  const setAllWorkflows = state((state) => state.setAllWorkflows);
  const setAllCategories = state((state) => state.setAllCategories);
  const allCategories = state((state) => state.allCategories);
  const loading = open && options.length === 0;
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
    // else {
    // }
  }, [open]);

  const setInputValue = (newInputValue) => {
    // console.log('setInputValue', newInputValue, props);
    props.setInputValue(newInputValue);
    // setValue(newInputValue);
  };

  const openDropdown = async () => {
    setOpen(true);
    let active = true;
    // TODO: getWorkflows will fetch {label, category} not just label
    // depending on props.placeholder will show categories of workflows
    // after selecting a category workflows will be filtered fon this category
    const workF: {
      id?: string;
      label?: string;
      category?: string;
    }[] = await getWorkflows();

    if (workF.length === 0) {
      setOpenSnackbar({
        open: true,
        text: 'It seems you have no workflows to work with!',
        severity: 'error',
      });
    } else if (workF[0].label === 'network error') {
      setOpenSnackbar({
        open: true,
        text: 'Something went wrong when contacting the server!',
        severity: 'error',
      });
    } else if (workF && workF.length > 0) {
      const categories = workF
        .filter((wof) => wof.category)
        .map((wo) => {
          return { title: wo.category };
        });
      console.log(categories);
      setAllCategories([...categories, { title: 'All' }]);
      setAllWorkflows(workF);
      if (active) {
        setOptions(
          props.placeholder === 'Workflows'
            ? filterworkfToCategories([...workF])
            : [...categories, { title: 'All' }]
        );
      }
    }

    return () => {
      active = false;
    };
  };

  const filterworkfToCategories = (workFlowDescriptions) => {
    let workflowToShow = [];
    console.log(props.category);
    if (props.category === 'All' || props.category == '') {
      workflowToShow = workFlowDescriptions;
    } else if (props.category != '') {
      workflowToShow = workFlowDescriptions.filter(
        (work) => work.category === props.category
      );
    }
    return workflowToShow;
  };

  return (
    <Autocomplete
      data-testid="async-autocomplete-drop"
      open={open}
      onOpen={() => {
        openDropdown();
        // setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      // isOptionEqualToValue={(option, value) => option.label === value.label}
      getOptionSelected={(option) =>
        props.placeholder === 'Categories'
          ? option.title || ''
          : option.label || ''
      }
      getOptionLabel={(option) => {
        // console.log(option);
        return props.placeholder === 'Workflows'
          ? option.label || ''
          : option.title || '';
      }}
      options={options}
      loading={loading}
      value={value}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
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
    />
  );
}

export default AutocompleteDrop;
