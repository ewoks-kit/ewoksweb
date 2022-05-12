import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Typography from '@material-ui/core/Typography';

import type { Task } from '../types';
import Tooltip from '@material-ui/core/Tooltip';
import orange1 from '../images/orange1.png';
import orange2 from '../images/orange2.png';
import orange3 from '../images/orange3.png';
import AggregateColumns from '../images/AggregateColumns.svg';
import Continuize from '../images/Continuize.svg';
import graphInput from '../images/graphInput.svg';
import graphOutput from '../images/graphOutput.svg';
import Correlations from '../images/Correlations.svg';
import CreateClass from '../images/CreateClass.svg';
import TextsmsIcon from '@material-ui/icons/Textsms';
import Upload from './Upload';
import AddIcon from '@material-ui/icons/Add';
import state from '../store/state';
import configData from '../configData.json';
import React from 'react';
import { Button, IconButton } from '@material-ui/core';
import ConfirmDialog from './ConfirmDialog';
import FormDialog from './FormDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/EditOutlined';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import { getTaskDescription, deleteTask } from '../utils/api';

const onDragStart = (event, { task_identifier, task_type, icon }) => {
  event.dataTransfer.setData('task_identifier', task_identifier);
  event.dataTransfer.setData('task_type', task_type);
  event.dataTransfer.setData('icon', icon);
  event.dataTransfer.effectAllowed = 'move';
};

const iconsObj = {
  orange1,
  Continuize,
  graphInput,
  graphOutput,
  orange2,
  orange3,
  AggregateColumns,
  Correlations,
  CreateClass,
  TextsmsIcon,
};

// Hosts the node images and categories to drag and drop to canvas
function AddNodes(props) {
  const taskCategories = state((state) => state.taskCategories);
  const setTaskCategories = state((state) => state.setTaskCategories);
  const tasks = state((state) => state.tasks);
  const setTasks = state((state) => state.setTasks);
  const selectedTask = state((state) => state.selectedTask);
  const setSelectedTask = state((state) => state.setSelectedTask);
  const setGraphOrSubgraph = state((state) => state.setGraphOrSubgraph);
  const [openAgreeDialog, setOpenAgreeDialog] = React.useState<boolean>(false);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const [doAction, setDoAction] = React.useState<string>('');
  const [openSaveDialog, setOpenSaveDialog] = React.useState<boolean>(false);
  const [elementToEdit, setElementToEdit] = React.useState<Task>({});
  const initializedTask = state((state) => state.initializedTask);

  const getTasks = async () => {
    try {
      const tasksData = await getTaskDescription();
      const tasks = tasksData.data as { items: Task[] };
      setTasks(tasks.items);
      setTaskCategories(tasks.items.map((tas) => tas.category));
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error.response?.data?.message || configData.retrieveTasksError,
        severity: 'error',
      });
    }
  };

  const insertGraph = () => {
    setGraphOrSubgraph(false);
  };

  const clickTask = (elem) => {
    setSelectedTask(elem);
  };

  const deleteTaskDialog = () => {
    setOpenAgreeDialog(true);
  };

  const agreeDeleteTask = async () => {
    setOpenAgreeDialog(false);
    try {
      await deleteTask(selectedTask.task_identifier);
      setOpenSnackbar({
        open: true,
        text: `Task was succesfully deleted!`,
        severity: 'success',
      });
      getTasks();
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error.message,
        severity: 'error',
      });
    }
  };

  const disAgreeDeleteTask = () => {
    setOpenAgreeDialog(false);
  };

  const action = (action, element) => {
    setDoAction(action);
    if (['cloneTask', 'editTask'].includes(action)) {
      const task = tasks.find((tas) => tas.task_identifier === element);
      setElementToEdit(task);
    } else if (action === 'newTask') {
      setElementToEdit(initializedTask);
    }
    setOpenSaveDialog(true);
  };

  return (
    <Accordion
      onChange={(e, expanded) => {
        if (expanded) {
          getTasks();
        }
      }}
    >
      <AccordionSummary
        expandIcon={<OpenInBrowser />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{props.title}</Typography>
      </AccordionSummary>
      <AccordionDetails style={{ flexWrap: 'wrap' }}>
        {taskCategories.map((categoryName) => (
          <Accordion key={categoryName}>
            <AccordionSummary
              expandIcon={<OpenInBrowser />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{categoryName}</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ flexWrap: 'wrap' }}>
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
                        task_identifier: elem.task_identifier,
                        task_type: elem.task_type,
                        icon: elem.icon,
                      })
                    }
                    draggable
                  >
                    <Tooltip title={elem.task_identifier} arrow>
                      <span
                        // onContextMenu={onRigthClick}
                        role="button"
                        tabIndex={0}
                        style={{
                          overflow: 'hidden',
                          overflowWrap: 'break-word',
                        }}
                      >
                        <img
                          src={
                            iconsObj[elem.icon]
                            // TODO: when no icon use a default or the text
                            // Object.keys(iconsObj).includes(elem.icon)
                            //   ? iconsObj[elem.icon]
                            //   : iconsObj['orange1']
                          }
                          alt={elem.task_identifier}
                        />
                      </span>
                    </Tooltip>
                  </span>
                ))}
              {categoryName === 'ewokscore' && (
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
                        icon: iconsObj['TextsmsIcon'],
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
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={insertGraph}
                        onKeyPress={insertGraph}
                      >
                        <AddIcon />G
                      </span>
                    </Upload>
                  )}
                </>
              )}
            </AccordionDetails>
            {selectedTask &&
              selectedTask.task_identifier &&
              categoryName !== 'ewokscore' &&
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
                    style={{ padding: '1px' }}
                    aria-label="edit"
                    onClick={() =>
                      action('editTask', selectedTask.task_identifier)
                    }
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <Button
                    startIcon={<BookmarksIcon />}
                    style={{ margin: '4px' }}
                    variant="outlined"
                    color="primary"
                    onClick={() =>
                      action('cloneTask', selectedTask.task_identifier)
                    }
                    size="small"
                  >
                    Clone
                  </Button>

                  <Button
                    // startIcon={<FiberNew />}
                    style={{ margin: '4px' }}
                    variant="outlined"
                    color="primary"
                    onClick={() => action('newTask', initializedTask)}
                    size="small"
                  >
                    New
                  </Button>
                </>
              )}
          </Accordion>
        ))}
      </AccordionDetails>
      <ConfirmDialog
        title={`Delete "${selectedTask && selectedTask.task_identifier}" task?`}
        content={`You are about to delete a task.
              Please make sure that it is not used in any workflow!
              Do you agree to continue?`}
        open={openAgreeDialog}
        agreeCallback={agreeDeleteTask}
        disagreeCallback={disAgreeDeleteTask}
      />
      <FormDialog
        elementToEdit={elementToEdit}
        action={doAction}
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
      />
    </Accordion>
  );
}

export default AddNodes;
