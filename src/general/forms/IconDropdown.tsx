import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { useIcons } from '../../api/icons';
import type { TaskFields } from './models';
import styles from './TaskForm.module.css';

interface Props {
  control: Control<TaskFields>;
}

function IconDropdown(props: Props) {
  const { control } = props;
  const icons = useIcons();

  return (
    <Controller
      name="icon"
      control={control}
      render={({ field }) => {
        const { onChange, ...restField } = field;

        return (
          <FormControl className={styles.dropdown}>
            <InputLabel id="iconNameInFormDialog">Icon</InputLabel>
            <Select
              labelId="iconNameInFormDialog"
              onChange={onChange}
              {...restField}
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
          </FormControl>
        );
      }}
    />
  );
}

export default IconDropdown;
