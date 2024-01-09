ewoksweb |version|
==================

*ewoksweb* is a frontend to create, visualize and execute `ewoks <https://ewoks.readthedocs.io/>`_ workflows in the web.

ewoksweb has been developed by the `Software group <http://www.esrf.eu/Instrumentation/software>`_ of the `European Synchrotron <https://www.esrf.eu/>`_.

The documentation is inspired by the `diataxis <https://diataxis.fr>`_ approach.

Install locally
---------------

Install the `ewoksserver <https://ewoksserver.readthedocs.io>`_ python package

.. code:: bash

    pip install ewoksserver[frontend]

Start the server and open the frontend in a web browser

.. code:: bash

    ewoks-server

Tutorials
---------

Follow the learning-oriented tutorials that will help accomplish a sequense of steps in order to:

.. toctree::
    :maxdepth: 1

    create_your_first_workflow
    create_a_task


How-to guides
-------------

The how-to guides are descriptions targeting the following tasks:

.. toctree::
    :maxdepth: 1

    new_open_save
    node_editing
    link_editing
    executing_a_workflow
    monitoring_executed_workflows
    manage_graphs_tasks_icons

Explanations
------------

General useful information regarding:

.. toctree::
    :maxdepth: 1

    editor_basics
    embedded_nodes
    link_validation
