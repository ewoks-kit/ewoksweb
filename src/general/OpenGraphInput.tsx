import type { ChangeEvent, ForwardedRef } from 'react';
import { forwardRef } from 'react';

import type { GraphEwoks } from '../types';
import { useLoadGraph } from './hooks';

interface Props {
  onGraphLoad: (graph: GraphEwoks) => void;
  label: string;
}

const OpenGraphInput = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLInputElement>) => {
    const { onGraphLoad, label } = props;
    const loadGraph = useLoadGraph(onGraphLoad);

    return (
      <input
        ref={ref}
        style={{ display: 'none' }}
        aria-label={label}
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) {
            return;
          }

          loadGraph(file);
        }}
      />
    );
  }
);

export default OpenGraphInput;
