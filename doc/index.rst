ewoksweb |release|
==================

*ewoksweb* is a frontend to create, visualize and execute `ewoks <https://ewoks.readthedocs.io/>`_ workflows in the web.

ewoksweb has been developed by the `Software group <http://www.esrf.eu/Instrumentation/software>`_ of the `European Synchrotron <https://www.esrf.eu/>`_.

.. toctree::
    :maxdepth: 2

    create_graph
    manage_graph
    node_editing
    link_editing
    execution
    manage_graphs_tasks_icons
    editor_details

Getting started
---------------

Install requirements

.. code:: bash

    python3 -m pip install ewoksserver[frontend]

Start the server that serves the frontend

.. code:: bash

    ewoks-server

or for an installation with the system python

.. code:: bash

    python3 -m ewoksserver.server
