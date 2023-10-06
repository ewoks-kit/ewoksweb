import { isString } from 'lodash';

import { useIcons } from '../../../api/icons';
import styles from './NodeIconControl.module.css';

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
    <div className={styles.container}>
      <span>Icon</span>
      <select
        aria-label="Change node icon"
        className={styles.select}
        value={value && iconNames.includes(value) ? value : DEFAULT_VALUE}
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
        <option>{DEFAULT_VALUE}</option>
        {iconNames.map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>
    </div>
  );
}

export default NodeIconControl;
