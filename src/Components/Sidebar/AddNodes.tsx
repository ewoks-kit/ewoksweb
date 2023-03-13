import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
} from '@material-ui/core';
import type { SvgIconTypeMap } from '@material-ui/core';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Typography from '@material-ui/core/Typography';

import type { Task } from 'types';
import Tooltip from '@material-ui/core/Tooltip';
import TextsmsIcon from '@material-ui/icons/Textsms';
import Upload from '../General/Upload';
import AddIcon from '@material-ui/icons/Add';
import useStore from 'store/useStore';
import commonStrings from 'commonStrings.json';
import React, { useCallback, useEffect, useState } from 'react';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import SidebarTooltip from './SidebarTooltip';
import FormDialog from '../General/FormDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/EditOutlined';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import { getTaskDescription, deleteTask } from 'api/api';
import { FormAction } from '../../types';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { textForError } from 'utils';
import type { OverridableComponent } from '@material-ui/core/OverridableComponent';
import TaskIcon from './TaskIcon';
import IconBoundary from '../../IconBoundary';
import useSelectedElementStore from '../../store/useSelectedElementStore';

interface DragInfo {
  task_identifier: string;
  task_type: string;
  icon: OverridableComponent<SvgIconTypeMap> | string;
}
const onDragStart = (
  event: React.DragEvent,
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
      padding: '0px 0px 15px 0px',
    },
    button: {
      margin: '4px',
    },
  })
);

interface AddNodesProps {
  title: string;
  openSaveDialogNewtask?: boolean;
}
// DOC: Hosts the nodes-tasks in their categories to drag and drop them into canvas
function AddNodes(props: AddNodesProps) {
  const classes = useStyles();

  const tasks = useStore((state) => state.tasks);
  const setTasks = useStore((state) => state.setTasks);
  const selectedTask = useStore((state) => state.selectedTask);
  const setSelectedTask = useStore((state) => state.setSelectedTask);
  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const [doAction, setDoAction] = useState<FormAction>();
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);
  const [elementToEdit, setElementToEdit] = useState<Task>({});
  const initializedTask = useStore((state) => state.initializedTask);
  const [expanded, setExpanded] = useState<boolean>(false);
  const selectedElementNew = useSelectedElementStore(
    (state) => state.selectedElement
  );

  const getTasks = useCallback(async () => {
    try {
      const tasksData = await getTaskDescription();
      if (tasksData?.data.items?.length > 0) {
        const allTasks = tasksData.data.items;
        setTasks(allTasks);
      }
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(error, commonStrings.retrieveTasksError),
        severity: 'error',
      });
    }
  }, [setOpenSnackbar, setTasks]);

  useEffect(() => {
    setExpanded(!selectedElementNew.id);
    // TODO: examine the strategy for re-fetching tasks-workflows-icons
    if (tasks.length === 0) {
      getTasks();
    }
  }, [selectedElementNew.id, tasks.length, getTasks]);

  useEffect(() => {
    if (props.openSaveDialogNewtask) {
      setDoAction(FormAction.newTask);
      setElementToEdit(initializedTask);
      setOpenSaveDialog(true);
    }
  }, [props.openSaveDialogNewtask, initializedTask]);

  const insertGraph = () => {
    setGraphOrSubgraph(false);
  };

  const clickTask = (task: Task) => {
    setSelectedTask(task);
  };

  const deleteTaskDialog = () => {
    setOpenAgreeDialog(true);
  };

  const agreeDeleteTask = async () => {
    setOpenAgreeDialog(false);
    if (!selectedTask.task_identifier) {
      return;
    }

    try {
      await deleteTask(selectedTask.task_identifier);
      setOpenSnackbar({
        open: true,
        text: `Task was successfully deleted!`,
        severity: 'success',
      });
      getTasks();
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(
          error,
          'Error in task deletion. Please check connectivity with the server'
        ),
        severity: 'error',
      });
    }
  };

  const disAgreeDeleteTask = () => {
    setOpenAgreeDialog(false);
  };

  function onAction(action: FormAction, element?: string) {
    setDoAction(action);

    if (['cloneTask', 'editTask'].includes(action)) {
      const task = tasks.find((tas) => tas.task_identifier === element);
      if (task) {
        setElementToEdit(task);
        setOpenSaveDialog(true);
        return;
      }
    }

    if (action === 'newTask') {
      setElementToEdit(initializedTask);
      setOpenSaveDialog(true);
    }
  }

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newExpanded: boolean
  ) => {
    if (newExpanded) {
      getTasks();
    }
    setExpanded(newExpanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      className="Accordions-sidebar"
    >
      <AccordionSummary
        expandIcon={<OpenInBrowser />}
        aria-controls="panel1a-content"
      >
        <SidebarTooltip
          text={`Drag and drop Tasks from their categories
          to the canvas to create graphs.`}
        >
          <Typography>{props.title}</Typography>
        </SidebarTooltip>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        {[...new Set(tasks.map((m) => m.category)).values()].map(
          (categoryName) => (
            <Accordion
              key={categoryName}
              className="add-nodes-accordion"
              data-cy={`add-nodes-category-${categoryName || 'no-category'}`}
            >
              <AccordionSummary
                expandIcon={<OpenInBrowser />}
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
                        selectedTask &&
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
              {/* TODO: This is not really readable:
                storing conditions in a variable/util. At first glance could be isSelectedTaskCategory
                Making a new component where you could deal with these conditions with early return to null */}
              {selectedTask?.task_identifier &&
                categoryName !== 'General' &&
                tasks.length > 0 &&
                tasks.find(
                  (tas) => tas.task_identifier === selectedTask.task_identifier
                )?.category === categoryName && (
                  <>
                    <IconButton
                      onClick={deleteTaskDialog}
                      aria-label="delete"
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      onClick={() =>
                        onAction(
                          FormAction.editTask,
                          selectedTask.task_identifier
                        )
                      }
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <Button
                      className={classes.button}
                      startIcon={<BookmarksIcon />}
                      variant="outlined"
                      color="primary"
                      onClick={() =>
                        onAction(
                          FormAction.cloneTask,
                          selectedTask.task_identifier
                        )
                      }
                      size="small"
                    >
                      Clone
                    </Button>

                    <Button
                      className={classes.button}
                      variant="outlined"
                      color="primary"
                      onClick={() => onAction(FormAction.newTask)}
                      size="small"
                    >
                      New
                    </Button>
                    <ConfirmDialog
                      title={`Delete "${selectedTask.task_identifier}" task?`}
                      content={`You are about to delete a task.
                                Please make sure that it is not used in any workflow!
                                Do you agree to continue?`}
                      open={openAgreeDialog}
                      agreeCallback={agreeDeleteTask}
                      disagreeCallback={disAgreeDeleteTask}
                    />
                  </>
                )}
            </Accordion>
          )
        )}
      </AccordionDetails>

      <FormDialog
        elementToEdit={elementToEdit}
        action={doAction || FormAction.undefined}
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
      />
    </Accordion>
  );
}

export default AddNodes;
