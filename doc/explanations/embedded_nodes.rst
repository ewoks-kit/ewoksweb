Embedded Nodes in ewoksweb
==========================

In the left sidebar the tasks available for creating the workflows exist within their
specified categories. The tasks and categories are being created by the user except the
**General** category which exists when installing ewoksweb and includes the following
tasks:

taskSkeleton
------------

It is a general empty task without functionality serving as a shell/skeleton.
It is used for quickly building graphs/workflows that can be visualized on the canvas. After
dragging them in the canvas the user can assign specific tasks to the empty taskSkeletons using
the right sidebar **Task Info** where **Task Identifier** is listed. When pressing the pencil
next to the **Task Identifier** a dialog appears where the user can change the identifier of
the task this node is based on by inputing the identifier of an existing task.
In that way the taskSkeleton node can modify its underlying task.

graphInput - graphoutput
------------------------

They are empty tasks serving only as an input in a workflow when needed.
Workflows can exist without inputs and outputs as the (`ewoks <http://link>`_ ) engine calculates its starting and ending
nodes by just analysing the given workflow. These special nodes become useful when a workflow is
intended to be used as a subworkflow in another workflow. In this case this nodes should be
included in the sub-workflow in order to provide a name to the inputs-outputs of the workflow.
The name given to this input-output nodes will be visible in the handles when the workflow is used in another
workflow as a sub-workflow.

note
----

This task creates a different node when it is dragged on the canvas that serves as a note. It is useful when the user needs
to have some useful text on the canvas with explainations of the way the workflow can be used, some comments on specific
nodes or links etc. Any note is visualized only through ewoksweb and does not alter the behavior of the workflow in any way.

subworkflow
-----------

By dragging this task-like entity the user is able to add a new workflow as a subworkflow. When dragging ends a dialog
appears that lets the user select a workflow from the server or the local drive to add as a subworkflow.
The subworkflow will appear on the canvas as a node with input and output handles as it was defined when building the
workflow. If no inputs and/or outputs are defined then the subworkflow will have no handles to be connected to other
nodes.
