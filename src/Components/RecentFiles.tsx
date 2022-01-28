import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import useStore from '../store';
import DashboardStyle from '../layout/DashboardStyle';

const useStyles = DashboardStyle;

export default function RecentFiles() {
  const classes = useStyles();

  const recentGraphs = useStore((state) => state.recentGraphs);
  const [selectedGraph, setSelectedGraph] = React.useState(true);

  const selectedGraphChange = (event) => {
    setSelectedGraph(event.target.value);
  };

  return (
    <FormControl variant="standard" className={classes.formControl}>
      <InputLabel
        id="demo-simple-select-filled-label"
        style={{ color: 'white' }}
      >
        Recent Files
      </InputLabel>
      <Select
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        value={selectedGraph}
        onChange={selectedGraphChange}
      >
        {recentGraphs.map((gr, index) => (
          <MenuItem value={gr.graph.label} key={gr.graph.id}>
            <em>{gr.graph.label}</em>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
