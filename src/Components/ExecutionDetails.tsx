import ReactJson from 'react-json-view';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import IntegratedSpinner from './IntegratedSpinner';
import state from '../store/state';

const executeWorkflow = () => {
  // co;
};

export default function ExecutionDetails() {
  // const { props } = propsIn;
  // const { element } = props;
  // const { setElement } = propsIn;

  const graphRF = state((state) => state.graphRF);

  const currentExecutionEvent = state((state) => state.currentExecutionEvent);
  // const currentExecutionEvent = state((state) => state.currentExecutionEvent);

  const executingEvents = state((state) => state.executingEvents);

  // useEffect(() => {}, [element.id, element]);

  return (
    <>
      <div>
        <b>Id:</b> {graphRF.graph.id}
      </div>
      <div>
        <b>Inputs </b>
        {/* {graphInputs.length > 0 && <DenseTable data={graphInputs} />} */}
      </div>
      <div>
        <b>Outputs </b>
        {/* {graphOutputs.length > 0 && <DenseTable data={graphOutputs} />} */}
      </div>
      <ReactJson
        src={executingEvents[currentExecutionEvent - 1]}
        name="Ewoks graph"
        theme="monokai"
        collapsed
        collapseStringsAfterLength={30}
        groupArraysAfterLength={15}
        enableClipboard={false}
        quotesOnKeys={false}
        style={{ backgroundColor: 'rgb(59, 77, 172)' }}
        displayDataTypes
      />
      <div style={{ display: 'flex' }}>
        <IntegratedSpinner
          getting={false}
          tooltip="Execute Workflow and exit Execution mode"
          action={executeWorkflow}
          onClick={() => {
            console.log('Starting Execution');
          }}
        >
          <PlayCircleOutlineIcon fontSize="large" />
        </IntegratedSpinner>
        <IntegratedSpinner
          getting={false}
          tooltip="Execute Workflow and exit Execution mode"
          action={executeWorkflow}
          onClick={() => {
            console.log('Starting Execution');
          }}
        >
          <PauseCircleOutlineIcon fontSize="large" />
        </IntegratedSpinner>
      </div>
    </>
  );
}
