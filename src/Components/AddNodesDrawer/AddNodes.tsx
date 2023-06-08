import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import useStore from 'store/useStore';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TaskManagementButtons from '../TopDrawer/TaskManagementButtons';
import AddSubgraphButton from './AddSubgraphButton';
import AddNoteButton from './AddNoteButton';
import TaskItem from './TaskItem';

export const useStyles = makeStyles(() =>
  createStyles({
    accordionDetails: {
      flexWrap: 'wrap',
    },
    imgHolder: {
      overflow: 'hidden',
      overflowWrap: 'break-word',
      position: 'relative',
      textAlign: 'center',
      color: 'black',
      display: 'flex',
    },
    imgLabelHolder: {
      position: 'absolute',
      bottom: '1px',
      left: '1px',
    },
    image: {
      padding: '0 0 15px 0',
    },
    button: {
      margin: '4px',
    },
  })
);

interface AddNodesProps {
  sidebar?: boolean;
}
// DOC: Hosts the nodes-tasks in their categories to drag and drop them into canvas
function AddNodes(props: AddNodesProps) {
  const { sidebar: isSidebar } = props;
  const showManagementButtons = !isSidebar;

  const classes = useStyles();

  const tasks = useStore((state) => state.tasks);
  const selectedTask = useStore((state) => state.selectedTask);
  const setSelectedTask = useStore((state) => state.setSelectedTask);

  return (
    <>
      {[...new Set(tasks.map((m) => m.category)).values()].map(
        (categoryName) => (
          <Accordion key={categoryName} className="add-nodes-accordion">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
            >
              <Typography>{categoryName}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              {tasks
                .filter((nod) => nod.category === categoryName)
                .map((elem) => (
                  <TaskItem
                    key={elem.task_identifier}
                    task={elem}
                    onClick={() => setSelectedTask(elem)}
                    isSelected={
                      elem.task_identifier === selectedTask.task_identifier
                    }
                  />
                ))}
              {isSidebar && categoryName === 'General' && (
                <>
                  <AddNoteButton />
                  <AddSubgraphButton />
                </>
              )}
            </AccordionDetails>
            {categoryName !== 'General' &&
              showManagementButtons &&
              selectedTask.category === categoryName && (
                <TaskManagementButtons />
              )}
          </Accordion>
        )
      )}
    </>
  );
}

export default AddNodes;
