import { style } from './NodeStyle';
import useStore from '../store';

const ExecutionStepsNode = (args) => {
  console.log(args);
  // useEffect(() => {
  // }, [args.data.comment, selectedElement.type]);

  const customTitle = {
    ...style.title,
    wordWrap: 'break-word',
    borderRadius: '25px',
    // color: 'red',
    backgroundColor: '#ced3ee',
    textAlign: 'center',
    padding: '1px',
  };

  const setCurrentExecutionEvent = useStore(
    (state) => state.setCurrentExecutionEvent
  );

  const goToEvent = (val) => {
    // update graphRF on store
    console.log(args.id, val);
    setCurrentExecutionEvent(val);
  };

  return (
    <div
      style={
        {
          ...style.body,
          ...(args.selected ? style.selected : []),
          padding: '2px',
        } as React.CSSProperties
      }
    >
      {args.data.label.split(',').map((val) => {
        return (
          <span style={{ maxWidth: '25px' }} className="icons" key={val}>
            {args.data.label.length > 0 && (
              <div
                onClick={() => goToEvent(val)}
                role="button"
                tabIndex={0}
                style={customTitle as React.CSSProperties}
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
};

export default ExecutionStepsNode;
