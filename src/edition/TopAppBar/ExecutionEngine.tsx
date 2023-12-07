import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';

type EngineOptions = 'default' | 'dask' | 'ppf';

interface Props {
  engine: EngineOptions;
  setEngine: (engine: EngineOptions) => void;
}
function ExecutionEngine(props: Props) {
  const { engine, setEngine } = props;

  return (
    <Card variant="outlined" style={{ margin: '2px' }}>
      <CardContent>
        <FormControl style={{ display: 'flex', flexDirection: 'row' }}>
          <b style={{ marginTop: '16px' }}>Execution engine</b>
          {/* <InputLabel id="demo-simple-select-label"></InputLabel> */}
          <Select
            value={engine}
            onChange={(event) => setEngine(event.target.value as EngineOptions)}
            style={{
              minWidth: '150px',
              marginLeft: '15px',
            }}
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
