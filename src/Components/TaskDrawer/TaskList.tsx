import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { ViewList, ViewModule } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useState } from 'react';
import useStore from 'store/useStore';
import useConfigStore from '../../store/useConfigStore';
import AddNoteButton from './AddNoteButton';
import AddSubgraphButton from './AddSubgraphButton';
import CreateTaskButton from './CreateTaskButton';
import TaskItem from './TaskItem';

import styles from './TaskList.module.css';

// DOC: Hosts the nodes-tasks in their categories to drag and drop them into canvas
function TaskList() {
  const tasks = useStore((state) => state.tasks);
  const [selectedTaskId, setSelectTaskId] = useState<string>();
  const { sidebarLayout, setSidebarLayout } = useConfigStore();

  return (
    <>
      <div>
        <CreateTaskButton />

        <IconButton
          onClick={() => setSidebarLayout('grid')}
          aria-label="Switch to grid layout"
        >
          <ViewModule />
        </IconButton>
        <IconButton
          onClick={() => setSidebarLayout('list')}
          aria-label="Switch to list layout"
        >
          <ViewList />
        </IconButton>
      </div>
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
