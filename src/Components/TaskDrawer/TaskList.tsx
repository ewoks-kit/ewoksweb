import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useState } from 'react';
import useStore from 'store/useStore';
import useConfigStore from '../../store/useConfigStore';
import AddNoteButton from './AddNoteButton';
import AddSubgraphButton from './AddSubgraphButton';
import TaskItem from './TaskItem';

import styles from './TaskList.module.css';
import TaskListToolbar from './TaskListToolbar';

// DOC: Hosts the nodes-tasks in their categories to drag and drop them into canvas
function TaskList() {
  const tasks = useStore((state) => state.tasks);
  const [selectedTaskId, setSelectTaskId] = useState<string>();
  const { sidebarLayout, setSidebarLayout } = useConfigStore();

  return (
    <>
      <TaskListToolbar onLayoutChange={setSidebarLayout} />
      {[...new Set(tasks.map((m) => m.category)).values()].map((category) => (
        <Accordion key={category} className="add-nodes-accordion">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>{category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div
              className={styles.itemContainer}
              data-gridlayout={sidebarLayout === 'grid' || undefined}
            >
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
                  <AddSubgraphButton />
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
