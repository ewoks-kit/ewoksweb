import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import type { Task } from '../../types';
import AddNoteButton from './AddNoteButton';
import AddSubworkflow from './AddSubworkflow';
import TaskItem from './TaskItem';
import styles from './TaskList.module.css';

const generalTasks: Task[] = [
  {
    icon: 'graphInput.svg',
    task_type: 'graphInput',
    task_identifier: 'graphInput',
    category: 'General',
  },
  {
    icon: 'graphOutput.svg',
    task_type: 'graphOutput',
    task_identifier: 'graphOutput',
    category: 'General',
  },
  {
    category: 'General',
    task_identifier: 'taskSkeleton',
    task_type: 'ppfmethod',
    icon: 'orange2.png',
  },
];

function GeneralTasksList() {
  return (
    <Accordion className="add-nodes-accordion">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
      >
        <Typography>General</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles.itemContainer}>
          {generalTasks.map((task) => (
            <TaskItem key={task.task_identifier} task={task} />
          ))}

          <AddNoteButton />
          <AddSubworkflow />
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

export default GeneralTasksList;
