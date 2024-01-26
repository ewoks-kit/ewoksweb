import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';

import type { EngineDropdownOption } from '../models';
import styles from './ExecutionDialog.module.css';

interface Props {
  engine: EngineDropdownOption;
  setEngine: (engine: EngineDropdownOption) => void;
}
function ExecutionEngine(props: Props) {
  const { engine, setEngine } = props;

  return (
    <Card variant="outlined">
      <CardContent>
        <FormControl className={styles.engineForm}>
          <span className={styles.engineSelectLabel}>Execution engine</span>
          <Select
            variant="standard"
            value={engine}
            onChange={(event) => {
              const { value } = event.target;
              setEngine(value as EngineDropdownOption);
            }}
            className={styles.engineSelect}
          >
            <MenuItem value="default">default</MenuItem>
            <MenuItem value="pypushflow">pypushflow</MenuItem>
            <MenuItem value="dask">dask</MenuItem>
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
}

export default ExecutionEngine;
