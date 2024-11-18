import { DynamicFeed, Textsms } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Typography from '@mui/material/Typography';

import { GRAPH_INPUT_ICON, GRAPH_OUTPUT_ICON } from '../utils';
import TaskItem from './TaskItem';
import styles from './TaskList.module.css';

interface Props {
  selectedTaskId: string | undefined;
  onTaskSelection: (id: string | undefined) => void;
}

function GeneralTasksList(props: Props) {
  const { selectedTaskId, onTaskSelection } = props;

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
      >
        <Typography aria-label="General">General</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles.itemContainer}>
          <TaskItem
            task={{
              task_type: 'graphInput',
              task_identifier: 'graphInput',
              icon: GRAPH_INPUT_ICON,
              category: 'General',
            }}
            selectedTaskId={selectedTaskId}
            onTaskSelection={onTaskSelection}
          />
          <TaskItem
            task={{
              task_type: 'graphOutput',
              task_identifier: 'graphOutput',
              icon: GRAPH_OUTPUT_ICON,
              category: 'General',
            }}
            selectedTaskId={selectedTaskId}
            onTaskSelection={onTaskSelection}
          />
          <TaskItem
            task={{
              task_type: 'method',
              task_identifier: 'taskSkeleton',
              category: 'General',
            }}
            selectedTaskId={selectedTaskId}
            onTaskSelection={onTaskSelection}
          />
          <TaskItem
            task={{
              task_type: 'note',
              task_identifier: 'note',
              category: 'General',
            }}
            selectedTaskId={selectedTaskId}
            onTaskSelection={onTaskSelection}
            tooltip="Drag to the canvas to add a note node"
            customIcon={Textsms}
          />
          <TaskItem
            task={{
              task_type: 'subworkflow',
              task_identifier: 'subworkflow',
              category: 'General',
            }}
            selectedTaskId={selectedTaskId}
            onTaskSelection={onTaskSelection}
            tooltip="Drag to the canvas to add a subworkflow node"
            customIcon={DynamicFeed}
          />
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

export default GeneralTasksList;
