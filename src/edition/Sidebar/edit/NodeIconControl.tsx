import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { isString } from 'lodash';
import { useIcons } from '../../../api/icons';
import { DEFAULT_ICON } from '../../../utils';

interface Props {
  value?: string;
  onChange: (v: string) => void;
}

function NodeIconControl(props: Props) {
  const { value = DEFAULT_ICON.name, onChange } = props;

  const icons = useIcons();

  return (
    <div>
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="replace-node-icon">Node Icon</InputLabel>
        <Select
          labelId="replace-node-icon"
          value={value || DEFAULT_ICON.name}
          label="Override Task Icon"
          onChange={(event) => {
            const iconName = event.target.value;
            if (!isString(iconName)) {
              return;
            }
            onChange(iconName);
          }}
        >
          {icons.map((icon) => (
            <MenuItem value={icon.name} key={icon.name}>
              {icon.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default NodeIconControl;
