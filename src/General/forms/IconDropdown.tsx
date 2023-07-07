import { InputLabel, Select, MenuItem, FormControl } from '@material-ui/core';
import { useIcons } from '../../api/icons';
import type { Control } from 'react-hook-form';

import styles from './TaskForm.module.css';

import { Controller } from 'react-hook-form';
import type { TaskFields } from './models';

interface Props {
  control: Control<TaskFields>;
}

function IconDropdown(props: Props) {
  const { control } = props;
  const { icons } = useIcons();

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
              // @ts-expect-error
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
