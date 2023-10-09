import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { useTasks } from '../../api/tasks';
import GeneralTasksList from './GeneralTasksList';
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
        <Accordion key={category}>
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
                    selectedTaskId={selectedTaskId}
                    onTaskSelection={setSelectTaskId}
                  />
                ))}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
      <GeneralTasksList
        selectedTaskId={selectedTaskId}
        onTaskSelection={setSelectTaskId}
      />
    </>
  );
}

export default TaskList;
