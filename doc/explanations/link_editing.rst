Link editing
============

Link editing is accessible on the right-sidebar when a link on the canvas is selected.

Each link has several attributes that follow the `Ewokscore <https://ewokscore.readthedocs.io/en/latest/definitions.html#link-attributes/>`_
specification. When a link is selected the following items are being depicted.

Label-Comment
-------------

- **Label** which is the user-friendly name of a link that the user can always change.
  Label will initially be empty on a new link. If a link has defined *Data Mappings* or *Conditions* then
  when clicking in the input the user is able to select to use them as a label.
- **Comment** where the user can save any kind of text/reminder regarding the link.

Data Mapping
------------

- **Data Mapping** where manual data mapping can take place for the link.

Conditions
----------

- **Conditions** where the user can define the conditions for the link to be activated and move to the next node.

Advanced
--------

- **Map all Data** where the user can define that no manual data mapping is needed for the links source and target nodes.
  If unchecked manual Data mapping is revealed.
- **on_error** which is a a special condition where a task raises an exception. Cannot be used in combination with
  *Conditions* which disappear if *on_error* is checked.

Link properties
---------------

- **Source** that is the node id the link start is attached to.
- **Target** that is the node id the link end is attached to.

Link styling
------------

The link style attributed include:

- **Link type** which if checked depicts the image associated with the task on the canvas and if not checked removes it.
- **Arrow Head** which if checked depicts the label of the node on the canvas and if not checked removes it.
- **Animated** which applies a moving animation effect on the selected link.
- **Color** which adds a surrounding frame and colors it with the selected color.
