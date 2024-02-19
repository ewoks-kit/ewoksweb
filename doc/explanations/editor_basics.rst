Editor basic structure
======================

EwoksWeb is a web application where users can visually **view/edit/create/execute** their workflows.
It mainly employs two pages:
  - the landing page for viewing/editing workflows and
  - the monitoring page for keeping track of the executing and executed workflows.

Edit page
---------

In the landing edit page workflows with their Nodes and Links are being visualized and graphically edited.

The general structure of the Edit page includes:

 - The **Canvas** for visualizing and editing graphs.
 - The right **Edit Sidebar** for viewing and editing properties of a graph including nodes and links.
 - The retractable left **Task Sidebar** where tasks, that are the building blocks of workflows,
   are presented in their categories.
 - The upper **navigation bar** to open, save, execute workflows and navigate.

The Edit sidebar changes its content whether a workflow, a node or a link is selected to depict the
information for each along with the appropriete editing components according to the
`ewoks <https://ewoks.readthedocs.io/>`_ abstraction model.

The Task sidebar populates the tasks that the user has incorporated in their categories if certain
categories are specified by the user. On it's top it features a button to allow discovering new tasks or/and
updating the existing.

The Navigation bar is shared between the edit and monitor page and includes from left to right:

  - the logo of EwoksWeb that is also a link for the edit page
  - the navigation to edit and monitor page
  - the identity of the workflow, when one is opened, in the middle
  - a quick open dropdown where all workflow identifiers are presented to the user to select and open one
  - the save button for the workflow on the canvas
  - a menu with the following options on the right:
      - **New workflow** to empty the canvas allowing for the creation of a new workflow.
      - **Open from disk** that allows opening a workflow from the computer's local file system.
      - **Download** to save a workflow in the computer local file system.
      - **Execute workflow** that initiates the process of executing the workflow that is depicted on the canvas.
      - **Manage icons** that opens a top drawer for managing the icons that can be assigned to nodes in a workflow.
      - **Create new task** that opens a dialog for providing the appropriete details for a new task.
