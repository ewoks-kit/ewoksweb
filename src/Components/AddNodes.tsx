import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';
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
import { Button } from '@material-ui/core';
import ConfirmDialog from './ConfirmDialog';
import FormDialog from './FormDialog';

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

// Hosts the node images and categories
// drag and drop to canvas
// TODO: right-click and view-delete?
// TODO: insert subgraph from disk should exist here?
function AddNodes() {
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

  const getTasks = async () => {
    const tasksData = await axios.get(
      `${configData.serverUrl}/tasks/descriptions`
    );
    const tasks = tasksData.data as Task[];
    setTasks(tasks);
    setTaskCategories(tasks.map((tas) => tas.category));
  };

  const insertGraph = () => {
    setGraphOrSubgraph(false);
  };

  const clickTask = (elem) => {
    setSelectedTask(elem);
  };

  const deleteTask = () => {
    setOpenAgreeDialog(true);
  };

  const agreeDeleteTask = async () => {
    setOpenAgreeDialog(false);
    await axios
      .delete(`${configData.serverUrl}/task/${selectedTask.task_identifier}`)
      .then(() => {
        setOpenSnackbar({
          open: true,
          text: `Task was succesfully deleted!`,
          severity: 'success',
        });
        getTasks();
      })
      .catch((error) => {
        setOpenSnackbar({
          open: true,
          text: error.message,
          severity: 'error',
        });
      });
  };

  const disAgreeDeleteTask = () => {
    setOpenAgreeDialog(false);
  };

  const action = (action, element) => {
    setDoAction(action);
    if (action === 'cloneTask') {
      const task = tasks.find((tas) => tas.task_identifier === element);
      // console.log(task);
      setElementToEdit(task);
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
        <Typography>Add Nodes</Typography>
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
                      {/* TODO: for deleting task and clone in dialog? */}
                      <span
                        // onContextMenu={onRigthClick}
                        role="button"
                        tabIndex={0}
                      >
                        <img
                          src={
                            Object.keys(iconsObj).includes(elem.icon)
                              ? iconsObj[elem.icon]
                              : iconsObj['orange1']
                          }
                          alt=""
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
                    <Tooltip title="add note" arrow>
                      <TextsmsIcon fontSize="large" />
                    </Tooltip>
                  </span>
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
                </>
              )}
            </AccordionDetails>
            {selectedTask &&
              selectedTask.task_identifier &&
              tasks.length > 0 &&
              tasks.find(
                (tas) => tas.task_identifier === selectedTask.task_identifier
              )?.category === categoryName && (
                <>
                  <Button
                    style={{ margin: '8px' }}
                    variant="outlined"
                    color="secondary"
                    onClick={deleteTask}
                    size="small"
                  >
                    Delete
                  </Button>
                  <Button
                    style={{ margin: '8px' }}
                    variant="outlined"
                    color="primary"
                    onClick={() =>
                      action('cloneTask', selectedTask.task_identifier)
                    }
                    // onClick={cloneTask}
                    size="small"
                  >
                    Clone
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
