Editor basic structure
======================

EwoksWeb is a web application where users can visually **view/create/edit** their workflows using
the `ewoks <https://ewoks.readthedocs.io/>` abstraction model. It mainly employs a canvas where
workflows with their Nodes and Links are being visualized and graphically edited.

The general structure of the EwoksWeb User Interface (UI) includes:

 - The **Canvas** for visualizing and editing graphs.
 - The left **Sidebar** for viewing and editing properties of a graph and its things it is made of: nodes and links.
 - The **upper bar** that hosts buttons for saving, opening and executing graphs.
 - Some **Dialogs** and **Drawers** for managing graphs-tasks-executions and icons.



Edit a Workflow
---------------

On the left sidebar under the Edit Graph dropdown the following can be edited:

 - the **Label** of the graph,
 - the **Comment** that can keep useful user notes about the graph and
 - the **Category** the specific graph belongs. By inserting a category the user can later filter their graphs based on the categories assigned to them making it easier to locate and explore graphs.

**Graph** is made up from **nodes and links** between the nodes. A node can be the representation of a:
 1. **task**
 2. **graph** that can be imported in a graph as a **subgraph**

To **add a node** you need to drag-and-drop one *Task* from the *Add Node* section of the sidebar on the left. The **Add Node** is populated with **Tasks** within their **Categories**.
Tasks are embedded in the system or added by the end-user. Nodes can be seen as an instance of a Task which represents a piece of code. Click for a deeper explanation of the [Ewoks concepts](https://ewokscore.readthedocs.io/en/latest/definitions.html).

A **subgraph** can be added to the graph from the server or from the local storage.

The embedded Tasks are in the category *General* and include: **input**, **output** and **skeleton** tasks.
Input and output are used for declaring the input and the output of a graph respectively.
They can be connected to ONLY ONE node in a given graph.
The task_skeleton is given as an empty cell when the user needs to get a node in the graph without having the
task with which is connected already defined.
In the *General* category 2 more icons represent the icon node that can be added and a *+G* which is used
to add a subgraph from the local storage to the graph.

Adding a subgraph in the graph is done by:
 - using the **+G** from the *sidebar->Add Nodes->General* category for graphs located in our hard-disk
 - using the *down arrow* on the top-bar for graphs that exist on the server.

A *subgraph* is represented in the graph as a node with multiple inputs and outputs. When *doubleclicking* on
a subgraph the canvas shows the subgraph internals i.e. another graph. To get back on the initial graph click
on the topbar left side where a path is created that provides the path to the upper graph.



Every change you make on a graph (including the addition of nodes and links) can be undone and redone using the
**Undo-Redo** buttons on the top-bar.

Nodes and Links have **node-properties** and **link-properties** respectively that can be further edited on the sidebar.
These properties comply to the `ewoks <https://ewoks.readthedocs.io/>` specification.
A graph can be saved and retrieved from the local-drive or from the server using the buttons on the top-bar.
Every button has a tooltip that appears on hover and describes its functionality.
