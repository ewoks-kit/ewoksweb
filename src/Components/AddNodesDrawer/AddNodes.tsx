import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import type { SvgIconTypeMap } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import type { Task } from 'types';
import Tooltip from '@material-ui/core/Tooltip';
import TextsmsIcon from '@material-ui/icons/Textsms';
import Upload from '../General/Upload';
import AddIcon from '@material-ui/icons/Add';
import useStore from 'store/useStore';
import type { DragEvent } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import type { OverridableComponent } from '@material-ui/core/OverridableComponent';
import TaskIcon from '../Sidebar/TaskIcon';
import IconBoundary from '../../IconBoundary';
import TaskManagementButtons from '../TopDrawer/TaskManagementButtons';

interface DragInfo {
  task_identifier: string;
  task_type: string;
  icon: OverridableComponent<SvgIconTypeMap> | string;
}
const onDragStart = (
  event: DragEvent,
  { task_identifier, task_type, icon }: DragInfo
) => {
  event.dataTransfer.setData('task_identifier', task_identifier);
  event.dataTransfer.setData('task_type', task_type);
  event.dataTransfer.setData('icon', icon as string);
  event.dataTransfer.effectAllowed = 'move';
};

const useStyles = makeStyles(() =>
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
  title?: string;
  showManagementButtons?: boolean;
}
// DOC: Hosts the nodes-tasks in their categories to drag and drop them into canvas
function AddNodes(props: AddNodesProps) {
  const classes = useStyles();

  const tasks = useStore((state) => state.tasks);
  const selectedTask = useStore((state) => state.selectedTask);
  const setSelectedTask = useStore((state) => state.setSelectedTask);
  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);

  const insertGraph = () => {
    setGraphOrSubgraph(false);
  };

  const clickTask = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <>
      {[...new Set(tasks.map((m) => m.category)).values()].map(
        (categoryName) => (
          <Accordion
            key={categoryName}
            className="add-nodes-accordion"
            data-cy={`add-nodes-category-${categoryName || 'no-category'}`}
          >
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
                  <span
                    // onContextMenu={() => clickTask(elem)}
                    onClick={() => clickTask(elem)}
                    aria-hidden="true"
                    role="button"
                    tabIndex={0}
                    key={elem.task_identifier}
                    className={`dndnode ${
                      selectedTask.task_identifier === elem.task_identifier
                        ? 'selectedTask'
                        : ''
                    }`}
                    onDragStart={(event1) =>
                      onDragStart(event1, {
                        task_identifier: elem.task_identifier || '',
                        task_type: elem.task_type || '',
                        icon: elem.icon || '',
                      })
                    }
                    draggable
                  >
                    <Tooltip title={elem.task_identifier || ''} arrow>
                      <span
                        role="button"
                        tabIndex={0}
                        className={classes.imgHolder}
                      >
                        <span className={classes.imgLabelHolder}>
                          {elem.task_identifier?.split('.').pop()}
                        </span>
                        <IconBoundary>
                          <TaskIcon
                            className={classes.image}
                            name={elem.icon}
                            alt={elem.task_identifier}
                          />
                        </IconBoundary>
                      </span>
                    </Tooltip>
                  </span>
                ))}
              {categoryName === 'General' && (
                <>
                  <span
                    role="button"
                    tabIndex={0}
                    key="addNote"
                    className="dndnode"
                    onDragStart={(event) =>
                      onDragStart(event, {
                        task_identifier: 'note',
                        task_type: 'note',
                        icon: TextsmsIcon,
                      })
                    }
                    draggable
                  >
                    {props.title === 'Add Nodes' && (
                      <Tooltip title="add note" arrow>
                        <TextsmsIcon fontSize="large" />
                      </Tooltip>
                    )}
                  </span>
                  {props.title === 'Add Nodes' && (
                    <Upload>
                      <Tooltip title="Add a subgraph from disk" arrow>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={insertGraph}
                          onKeyPress={insertGraph}
                          data-testid="addSubgraphFromDisk"
                        >
                          <AddIcon />G
                        </span>
                      </Tooltip>
                    </Upload>
                  )}
                </>
              )}
            </AccordionDetails>
            {categoryName !== 'General' &&
              props.showManagementButtons &&
              tasks.find(
                (tas) => tas.task_identifier === selectedTask.task_identifier
              )?.category === categoryName && <TaskManagementButtons />}
          </Accordion>
        )
      )}
    </>
  );
}

export default AddNodes;
