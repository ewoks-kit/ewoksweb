import type { SliderTypeMap } from '@mui/material';
import { Slider } from '@mui/material';
import { useState } from 'react';

import styles from './NodeWidthControl.module.css';

interface Props {
  nodeWidth?: number;
  onChangeCommitted: SliderTypeMap['props']['onChangeCommitted'];
}

function NodeWidthControl(props: Props) {
  const { nodeWidth = 100, onChangeCommitted } = props;
  const [value, setValue] = useState(nodeWidth);

  return (
    <div className={styles.container}>
      <span className={styles.label}>Width</span>
      <Slider
        aria-label="Change node width"
        className={styles.slider}
        color="primary"
        value={value}
        onChange={(_, newValue) => {
          if (typeof newValue === 'number') {
            setValue(newValue);
          }
        }}
        onChangeCommitted={onChangeCommitted}
        min={40}
        max={300}
        valueLabelDisplay="on"
      />
    </div>
  );
}

export default NodeWidthControl;
