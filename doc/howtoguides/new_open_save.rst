New-Open-Save workflows
=======================

New Workflow
------------

When landing in ewoksweb you can start building your workflow immediately. The editor has in the middle
of the top navigation bar the title **Untitled workflow (unsaved)** that will be replaced by the name
of the workflow once the workflow is first saved.
By clicking the **New** button with the tooltip *start a new workflow* on the upper
bar a dialog appears requesting the new workflow **name**.
By inserting a unique name and pressing **SAVE WORKFLOW** the dialog disappears and
the canvas is available with the name entered appearing in the upper bar left side.
If the given name is already used a message warns the user for providing another name.

Open a Workflow
---------------

The user can open a graph in the canvas from:

- the **server** by searching using the dropdown in the upper bar and pressing the **Open from server**.
   The workflows management tab can also be used to open-delete a workflow. It is located in the upper drawer
   that open when pressing the second button from the right in the upper bar. In the workflow management bar
   a workflow can be selected exploiting the categories dropdown for easier search.
   Its details are being fetched and presented to the user after selection.
   Using the 2 buttons under the search boxes the user can open a workflow on the canvas or **delete** it from the server.
- the **local storage** by pressing the button with the directory icon on the upper bar.

Save a Workflow
---------------

When the user makes all th changes to a new or an existing workflow he can use the disk-button on the
top right to save any changes in the workflow. All workflows are being saved in the backend
`ewoksserver <https://gitlab.esrf.fr/workflow/ewoks/ewoksserver>`_ within the filesystem in their ewoks representation
json format. The option to **Download** the workflow in their local drive is also available within the
up-right menu next to the disk-saving button.

