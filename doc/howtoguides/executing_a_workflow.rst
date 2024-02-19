Execute workflows
=================

The concept **execute a workflow** is used when a workflow is being send to the
`ewoksserver <https://gitlab.esrf.fr/workflow/ewoks/ewoksserver>`_ for each tasks to be executed.

In order for a workflow to be executed it needs:

 - to be open on the canvas and
 - the button execution from the top-bar menu to be pressed.

Then the dialog **Execute a workflow** appears where the user can provide the following parameters:

 - The **Workflow Inputs** for providing the input for each node in the workflow. There the user can
   add a new input by pressing the **ADD+** button and select whether he needs to provide a specific
   input into **All nodes**, **All input nodes** or a specific node in the workflow. These choises are
   provided in a dropdown where all nodes in the graph are also available.
 - The **Execution engine** and **Select Worker** where the user is able to select the engine to use
   in his execution and the worker that will perform it. Both are given as dropdowns for the user to select
   prefilled with their default values.

When the appropriete execution details are inputted the user can proceed to execution by pressing the
**SAVE & EXECUTE** button on the dialog. By pressing it the user saves the workflow on the server as implied
by the button name and is redirected to the monitor page. There the application starts receiving **events**
from the server that report on the progress of the execution.
