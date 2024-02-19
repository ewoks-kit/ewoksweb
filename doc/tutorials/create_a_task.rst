Create your first task
======================

Tasks can be managed in the second tab of the upper drawer. By clicking on the dropdown
the tasks in their categories are revealed with their assigned icons. When clicking on
a task underneath it buttons appear for deleting, editing and cloning the task.
By deleting the task it is removed from the server permanently and can affect the
workflows that contain it if any.

Editing and cloning opens a dialog with all task properties below also described
in `Ewokscore <https://ewokscore.readthedocs.io/en/latest/definitions.html#task-implementation/>`_:

 - New Name - Identifier: the Task will be saved to file with this name-identifier.
 - Task Type
 - Category
 - Optional Inputs
 - Required Inputs
 - Outputs
 - Icon which is the icon that will appear in the task and in the nodes that will be created from this task.

Tasks can be discovered in the server if the slider **Task Discovery** is used.
When is set it open an input where the module name will be inserted and a button
to start the discovery process on the server. The process assumes that the absolute
path to the python module is given for the discovery mechanism to find the python tasks described in there.
