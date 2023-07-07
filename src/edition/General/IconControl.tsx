import type { SelectProps } from '@material-ui/core';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';
import { useIcons } from '../../api/icons';

interface Props {
  value: string;
  onChange: SelectProps['onChange'];
}

function IconControl(props: Props) {
  const { icons } = useIcons();
  const { value, onChange } = props;

  return (
    <FormControl>
      <InputLabel id="iconNameInFormDialog">Icon</InputLabel>
      <Select
        labelId="iconNameInFormDialog"
        value={value}
        label="Icon"
        onChange={onChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {icons.map((icon) => (
          <MenuItem value={icon.name} key={icon.name}>
            {icon.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>
        Select from the existing icons or upload a new one
      </FormHelperText>
    </FormControl>
  );
}

export default IconControl;
