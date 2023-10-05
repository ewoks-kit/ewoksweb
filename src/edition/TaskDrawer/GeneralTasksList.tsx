import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { DynamicFeed, Textsms } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
        <Typography>General</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles.itemContainer}>
          <TaskItem
            task={{
              task_type: 'graphInput',
              task_identifier: 'graphInput',
              icon: 'graphInput.svg',
              category: 'General',
            }}
            selectedTaskId={selectedTaskId}
            onTaskSelection={onTaskSelection}
          />
          <TaskItem
            task={{
              task_type: 'graphOutput',
              task_identifier: 'graphOutput',
              icon: 'graphOutput.svg',
              category: 'General',
            }}
            selectedTaskId={selectedTaskId}
            onTaskSelection={onTaskSelection}
          />
          <TaskItem
            task={{
              task_type: 'ppfmethod',
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
