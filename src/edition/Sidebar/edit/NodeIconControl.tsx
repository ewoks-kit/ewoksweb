import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { isString } from 'lodash';
import { useIcons } from '../../../api/icons';

interface Props {
  value?: string;
  onChange: (v: string) => void;
  onRemove: () => void;
}

const DEFAULT_VALUE = 'Use default';

function NodeIconControl(props: Props) {
  const { value, onChange, onRemove } = props;

  const icons = useIcons();
  const iconNames = icons.map((icon) => icon.name);

  return (
    <div>
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="replace-node-icon">Node Icon</InputLabel>
        <Select
          labelId="replace-node-icon"
          value={value && iconNames.includes(value) ? value : DEFAULT_VALUE}
          label="Override Task Icon"
          onChange={(event) => {
            const iconName = event.target.value;
            if (!isString(iconName)) {
              return;
            }

            if (iconName === DEFAULT_VALUE) {
              onRemove();
            } else {
              onChange(iconName);
            }
          }}
        >
          <MenuItem value={DEFAULT_VALUE}>{DEFAULT_VALUE}</MenuItem>
          {iconNames.map((name) => (
            <MenuItem value={name} key={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default NodeIconControl;
