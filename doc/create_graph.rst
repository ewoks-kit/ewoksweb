Create a Graph
===========

Graph is made up from nodes and links between the nodes.
To add a node you need to drag-and-drop one *Task* from the *Add Node* section of the sidebar on the left.
A node can also be a *subgraph* reffering to an existing graph that can be added to the graph from the server
or from the local storage.

The *Add Node* is populated with *Tasks* within their *Categories*.
Tasks are embedded in the system or created by the end-user.
Nodes can be seen as an instance of a Task which represents a piece of code. A deeper explanation of the Ewoks
concepts can be found here <https://ewokscore.readthedocs.io/en/latest/definitions.html>`

The embedded Tasks are in the category *General* and inlude: input, output and skeleton tasks.
Input and output are used for declaring the input and the output of a graph respectively.
They can be connected to ONLY ONE node in a given graph.
The task_skeleton is given as an empty cell when the user needs to get a node in the graph without having the
task with which is conected already defined.
In the *General* category 2 more icons represent the icon node that can be added and a *+G* which is used
to add a subgraph from the local storage to the graph.

Adding a subgraph in the graph is done by:
using the *+G* from the sidebar->Add Nodes->General category for graphs located in our hard-disk
using the down arrow on the top-bar for graphs that exist on the server.

A *subgraph* is represented in the graph as a node with multiple inputs and outputs. When doubleclicking on
a subgraph the canvas shows the subgraph internals i.e. another graph. To get back on the initial graph click
on the topbar left side where a path is created that provides the path to the upper graph.

Nodes can be conected with links that can be created in 2 ways:
by clicking on the handles that the nodes have on their sides and sliding without releasing the click
to a handle of another node.
by clicking on a handle and then on another handle.

Every change you make on a graph including the addition og nodes and links can be undone and redone using the
Undo-Redo buttons on the top-bar.

Nodes and Links have node-properties and link-properties respectively that can be further edited.
A graph can be saved and retrieved from the local-drive or from the server using the buttons on the top-bar.
Every button has a tooltip that appears on hover and describes its functionality.



*ewoksweb* is a frontend to create, visualize and execute `ewoks <https://ewoks.readthedocs.io/>`_ workflows in the web.
