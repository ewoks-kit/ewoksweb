import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import useStore from 'store/useStore';
import AddSubgraphButton from './AddSubgraphButton';
import AddNoteButton from './AddNoteButton';
import TaskItem from './TaskItem';
import styles from './AddNodes.module.css';
import { ViewModule, ViewList } from '@material-ui/icons';
import useConfigStore from '../../store/useConfigStore';
import CreateTaskButton from './CreateTaskButton';

interface AddNodesProps {
  sidebar?: boolean;
}
// DOC: Hosts the nodes-tasks in their categories to drag and drop them into canvas
function AddNodes(props: AddNodesProps) {
  const { sidebar: isSidebar } = props;

  const tasks = useStore((state) => state.tasks);
  const selectedTask = useStore((state) => state.selectedTask);
  const setSelectedTask = useStore((state) => state.setSelectedTask);
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
                    onClick={() => setSelectedTask(task)}
                    isSelected={
                      task.task_identifier === selectedTask.task_identifier
                    }
                  />
                ))}
              {isSidebar && category === 'General' && (
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

export default AddNodes;
