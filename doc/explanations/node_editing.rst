Node editing
============

Node editing is accessible on the right-sidebar when a node on the canvas is selected.

Each node has several attributes that follow the
`ewokscore <https://ewokscore.readthedocs.io/en/latest/definitions.html#node-attributes>`_
specification. When a node is selected the following items are being depicted.

Label-Comment
-------------

 - **Label** which is the user-friendly name of a node that the user can always change.
   Label will initially take the name of the task the specific node is referred to.
 - **Comment** where the user can save any kind of text like a description of the node functionallity
   in the graph.

Default Inputs
--------------

Where the user can define the default-inputs for any given node representing a task or a subgraph.

Advanced
--------

    - **Inputs-complete** when the default input covers all required input. ...
    - **Default Error Node** that makes the node to be the default-error-node.
      Each graph can have zero to one such nodes. When **Default Error Node**
      is checked the **Map all Data** appears already ticked which means that no
      extra Data Mapping is needed for the Default Error Node. If unchecked the
      Map all Data reveals the **Data Mapping** where manual mapping can take place.

Task Info
---------

    - **Task identifier** that is the id of the task this node is based on.
    - **Node id** that is a read-only string with the unique id the node has in the workflow.
    - **Task type** that is the type of the task the node is based on. ...

Appearance
----------

The following parameters can adjust the way the nodes are being depicted on the canvas:

  - **With image** to control the appearance of the image/icon selected for the node to be visible.
  - **With label** to control the appearance of the label of the node.
  - **With border** to add thicker border for the node. When checked a color selector appears with the label
    **Border color** to select a color for the added border.
  - **More handles** to add more input and output handles to the node at its top and bottom. Used when
    rearranging of the nodes in the graph is needed to make it easier to depict and understand.
  - **Size** that employs a slider to control the size of the node on the canvas.
  - **Icon** where a dropdown provides all the alternatives for changing the icon appearing at
    the middle of each node
