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

const onRigthClick = (event) => {
  event.preventDefault();
  //console.log('rightclick', tasks);
};

// Hosts the node images and categories
// drag and drop to canvas
// TODO: right-click and view-delete?
// insert subgraph from disk?
function AddNodes() {
  const taskCategories = state((state) => state.taskCategories);
  const setTaskCategories = state((state) => state.setTaskCategories);
  const tasks = state((state) => state.tasks);
  const setTasks = state((state) => state.setTasks);
  const setGraphOrSubgraph = state((state) => state.setGraphOrSubgraph);

  const getTasks = async () => {
    const tasksData = await axios.get(`${configData.serverUrl}/tasks`);
    const tasks = tasksData.data as Task[];
    setTasks(tasks);
    setTaskCategories(tasks.map((tas) => tas.category));
  };

  const insertGraph = () => {
    setGraphOrSubgraph(false);
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
                    role="button"
                    tabIndex={0}
                    key={elem.task_identifier}
                    className="dndnode"
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
                        onContextMenu={onRigthClick}
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
                    <span role="button" tabIndex={0} onClick={insertGraph}>
                      <AddIcon />G
                    </span>
                  </Upload>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
        {/* {tasks.map((elem) => (
          <span
            role="button"
            tabIndex={0}
            key={elem.task_identifier}
            className="dndnode"
            onDragStart={(event) =>
              onDragStart(event, {
                task_identifier: elem.task_identifier,
                task_type: elem.task_type,
                icon: elem.icon,
              })
            }
            draggable
          >
            <Tooltip title={elem.task_identifier} arrow>
              <img
                src={
                  Object.keys(iconsObj).includes(elem.icon)
                    ? iconsObj[elem.icon]
                    : iconsObj['orange1']
                }
                alt=""
              />
            </Tooltip>
          </span>
        ))} */}
      </AccordionDetails>
    </Accordion>
  );
}

export default AddNodes;
