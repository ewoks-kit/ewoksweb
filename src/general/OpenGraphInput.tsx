import type { ChangeEvent, ForwardedRef } from 'react';
import { forwardRef } from 'react';

import type { Workflow } from '../types';
import { loadGraphFromFile as graphFromFileLoader } from '../utils';

interface Props {
  onGraphLoad: (graph: Workflow) => void;
  label: string;
}

const OpenGraphInput = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLInputElement>) => {
    const { onGraphLoad, label } = props;
    const loadGraph = graphFromFileLoader(onGraphLoad);

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
  },
);

export default OpenGraphInput;
