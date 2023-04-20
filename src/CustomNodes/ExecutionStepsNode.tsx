/*
A kind of node to appear on the canvas carrying the number of the
step that has been executed.
*/
import type { CSSProperties } from 'react';
import { style } from './nodeStyles';

import useStore from '../store/useStore';
import type { NodeProps } from 'reactflow';

function ExecutionStepsNode(args: NodeProps) {
  const customTitle: CSSProperties = {
    ...style.title,
    wordWrap: 'break-word',
    borderRadius: '25px',
    backgroundColor: '#ced3ee',
    textAlign: 'center',
    padding: '1px',
    // DATAC
    color: args.data.event.error ? 'red' : '#4493dd',
    fontSize: '1.2em',
  };

  const setCurrentExecutionEvent = useStore(
    (state) => state.setCurrentExecutionEvent
  );

  const goToEvent = (val: number) => {
    setCurrentExecutionEvent(val);
  };

  return (
    <div
      className="node-content"
      style={{
        padding: '2px',
      }}
    >
      {/* DATAC */}
      {args.data.label.split(',').map((val: number) => {
        return (
          <span style={{ maxWidth: '25px' }} className="icons" key={val}>
            {args.data.label.length > 0 && (
              <div
                onClick={() => goToEvent(val)}
                onKeyUp={() => goToEvent(val)}
                role="button"
                tabIndex={0}
                style={customTitle}
                key={val}
              >
                {val}
              </div>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default ExecutionStepsNode;
