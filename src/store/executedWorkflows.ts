import type { ExecutedWorkflowEvents } from '../types';

const executedWorkflows = (set, get) => ({
  executedWorkflows: executedWork1 as ExecutedWorkflowEvents,

  setExecutedWorkflows: (execWorkflow: ExecutedWorkflowEvents) => {
    // Add all events to keep track of the order they came in
    const prevState = get((prev) => prev);
    // calculate the id of the event based on the order of arrival
    const workflow = {
      ...execWorkflow,
      id: (prevState.executedEvents.length as number) + 1,
    };
    // send it to executing events to addapt
    prevState.setExecutingWorkflows(workflow, true);
    set((state) => ({
      ...state,
      executedWorkflows: [...prevState.executedWorkflows, workflow],
    }));
  },
});

export default executedWorkflows;

const jobid = 'a288c8-21ad384d70b9acc598f3af395b';
const jobid2 = 'a288c8-21ad384d70b9acc598f3af395b-2';
const work1 = [
  {
    host_name: 'lkoumouts',
    process_id: '7078',
    user_name: 'koumouts',
    job_id: jobid,
    binding: null,
    context: 'workflow',
    workflow_id: 'SumListDemo', // which is the label
    type: 'start',
    time: '2022-06-29T10:07:21.092689+02:00',
    error: null,
    error_message: null,
    error_traceback: null,
    node_id: null,
    task_id: null,
    progress: null,
    task_uri: null,
    input_uris: null,
    output_uris: null,
    id: 2,
  },
  {
    host_name: 'lkoumouts',
    process_id: '7078',
    user_name: 'koumouts',
    job_id: jobid,
    binding: null,
    context: 'workflow',
    workflow_id: 'SumListDemo',
    type: 'end',
    time: '2022-06-29T10:07:39.173454+02:00',
    error: 'false',
    error_message: null,
    error_traceback: null,
    node_id: null,
    task_id: null,
    progress: null,
    task_uri: null,
    input_uris: null,
    output_uris: null,
    id: 17,
  },
];

const work2 = [
  {
    host_name: 'lkoumouts',
    process_id: '7077',
    user_name: 'koumouts',
    job_id: jobid2,
    binding: null,
    context: 'workflow',
    workflow_id: 'SumDemo', // which is the label
    type: 'start',
    time: '2022-06-29T10:07:21.092689+02:00',
    error: null,
    error_message: null,
    error_traceback: null,
    node_id: null,
    task_id: null,
    progress: null,
    task_uri: null,
    input_uris: null,
    output_uris: null,
    id: 2,
  },
  {
    host_name: 'lkoumouts',
    process_id: '7077',
    user_name: 'koumouts',
    job_id: jobid2,
    binding: null,
    context: 'workflow',
    workflow_id: 'SumDemo',
    type: 'end',
    time: '2022-06-29T10:07:39.173454+02:00',
    error: 'false',
    error_message: null,
    error_traceback: null,
    node_id: null,
    task_id: null,
    progress: null,
    task_uri: null,
    input_uris: null,
    output_uris: null,
    id: 17,
  },
];

const executedWork1 = { jobs: [work1, work2] };
// if jobs in query parameters an array of arrays of 2 event objects
// if events in query parameters an array of arrays of multiple event objects

// const eventsWork1 = [
//   {
//     host_name: 'lkoumouts',
//     process_id: '7078',
//     user_name: 'koumouts',
//     job_id: jobid,
//     binding: null,
//     context: 'node',
//     workflow_id: 'SumListDemo',
//     type: 'start',
//     time: '2022-06-29T10:07:21.097883+02:00',
//     error: null,
//     error_message: null,
//     error_traceback: null,
//     node_id: 'task2',
//     task_id: 'ewokscore.tests.examples.tasks.sumtask.SumTask',
//     progress: null,
//     task_uri: null,
//     input_uris: '[]',
//     output_uris: '[]',
//     id: 3,
//   },
//   {
//     host_name: 'lkoumouts',
//     process_id: '7078',
//     user_name: 'koumouts',
//     job_id: jobid,
//     binding: null,
//     context: 'node',
//     workflow_id: '11demoExecution',
//     type: 'end',
//     time: '2022-06-29T10:07:23.103917+02:00',
//     error: 'false',
//     error_message: null,
//     error_traceback: null,
//     node_id: 'task2',
//     task_id: 'ewokscore.tests.examples.tasks.sumtask.SumTask',
//     progress: null,
//     task_uri: null,
//     input_uris: null,
//     output_uris: null,
//     id: 4,
//   },
//   {
//     host_name: 'lkoumouts',
//     process_id: '7078',
//     user_name: 'koumouts',
//     job_id: jobid,
//     binding: null,
//     context: 'node',
//     workflow_id: '11demoExecution',
//     type: 'end',
//     time: '2022-06-29T10:07:29.118082+02:00',
//     error: 'false',
//     error_message: null,
//     error_traceback: null,
//     node_id: 'task0',
//     task_id: 'ewokscore.tests.examples.tasks.sumlist.SumList',
//     progress: null,
//     task_uri: null,
//     input_uris: null,
//     output_uris: null,
//     id: 6,
//   },
// ];
