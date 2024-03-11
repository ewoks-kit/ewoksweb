import { FormControl } from '@mui/material';
import Input from '@mui/material/Input';

import type { RowValue } from '../../../../types';
import { RowType } from '../../../../types';
import BooleanControl from './BooleanControl';
import EditJsonButton from './EditJsonButton';
import styles from './MultiTypeEditControl.module.css';
import NumberInput from './NumberInput';

interface Props {
  value: RowValue;
  type: RowType;
  onChange: (newValue: RowValue) => void;
  disable?: boolean;
}

function MultiTypeEditControl(props: Props) {
  const { value, type, onChange, disable } = props;

  if (type === RowType.List || type === RowType.Dict) {
    return (
      <EditJsonButton
        value={value}
        type={type}
        onChange={onChange}
        disabled={disable}
      />
    );
  }

  if (type === RowType.Bool) {
    return (
      <BooleanControl value={value} onChange={onChange} disabled={disable} />
    );
  }

  if (type === RowType.Number) {
    return <NumberInput value={value} onChange={onChange} disabled={disable} />;
  }

  return (
    <FormControl variant="standard" fullWidth>
      <Input
        disabled={disable}
        value={String(value)}
        type="text"
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
        inputProps={{ 'aria-label': `Edit input value` }}
      />
    </FormControl>
  );
}

export default MultiTypeEditControl;
