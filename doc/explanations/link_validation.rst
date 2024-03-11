Rules for link validation
=========================

There are certain rules according to which a link can exist or not. These rules are:
  - There can be only one link between two nodes in a workflow. If there is a need to
    map outputs of one node to specific inputs of the other node this is done through
    **Data mapping** and not by adding multiple links between the two nodes.
  - Each **graphInput** and **graphOutput** node can be connected to only one node when
    creating a workflow that can be used as a subworkflow.
  - A subgraph can be connected to different nodes as long as it has multiple inputs
    and/or outputs since each input/output can be connected to one node.
