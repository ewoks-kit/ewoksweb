import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useState } from 'react';
import { useTasks } from '../../api/tasks';
import AddNoteButton from './AddNoteButton';
import AddSubworkflow from './AddSubworkflow';
import TaskItem from './TaskItem';

import styles from './TaskList.module.css';
import TaskListToolbar from './TaskListToolbar';

// DOC: Hosts the nodes-tasks in their categories to drag and drop them into canvas
function TaskList() {
  const tasks = useTasks();

  const [selectedTaskId, setSelectTaskId] = useState<string>();

  return (
    <>
      <TaskListToolbar />

      {[...new Set(tasks.map((m) => m.category)).values()].map((category) => (
        <Accordion key={category} className="add-nodes-accordion">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>{category || 'No category defined'}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={styles.itemContainer}>
              {tasks
                .filter((nod) => nod.category === category)
                .map((task) => (
                  <TaskItem
                    key={task.task_identifier}
                    task={task}
                    onClick={() => setSelectTaskId(task.task_identifier)}
                    isSelected={task.task_identifier === selectedTaskId}
                  />
                ))}
              {category === 'General' && (
                <>
                  <AddNoteButton />
                  <AddSubworkflow />
                </>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

export default TaskList;
