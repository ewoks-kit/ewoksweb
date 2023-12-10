import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';

import styles from './ExecutionDialog.module.css';
import type { EngineOptions } from './models';

interface Props {
  engine: EngineOptions;
  setEngine: (engine: EngineOptions) => void;
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
            onChange={(event) => setEngine(event.target.value as EngineOptions)}
            className={styles.engineSelect}
          >
            <MenuItem value="">default</MenuItem>
            <MenuItem value="pypushflow">pypushflow</MenuItem>
            <MenuItem value="dask">dask</MenuItem>
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
}

export default ExecutionEngine;
