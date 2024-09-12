import { Checkbox } from '@mui/material';
import { capitalize } from 'lodash';

import styles from './EditSidebar.module.css';

interface Props {
  value?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

function SidebarCheckbox(props: Props) {
  const { value, onChange, label, className } = props;
  const id = label.split(' ').map(capitalize).join('');

  return (
    <div className={className}>
      <Checkbox
        id={id}
        className={styles.checkbox}
        color="primary"
        checked={value}
        onChange={(_, checked) => onChange(checked)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export default SidebarCheckbox;
