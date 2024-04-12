ewoksweb |version|
==================

.. toctree::
    :hidden:

    tutorials
    howtoguides
    explanations

*ewoksweb* is a frontend to create, visualize and execute `ewoks <https://ewoks.readthedocs.io/>`_ workflows in the web.

ewoksweb has been developed by the `Software group <http://www.esrf.eu/Instrumentation/software>`_ of the `European Synchrotron <https://www.esrf.eu/>`_.

The documentation is inspired by the `diataxis <https://diataxis.fr>`_ approach.

Install locally
---------------

Install the `ewoksweb <https://gitlab.esrf.fr/workflow/ewoks/ewoksweb>`_ Python package

.. code:: bash

    pip install ewoksweb

Start the application via

.. code:: bash

    ewoksweb

The web app will be available at ``localhost:8000``.

.. note::

    ``ewoksweb`` takes the port 8000 by default. If there are other applications running on this port (e.g. iTunes radio on Mac), another port can be chosen

    .. code:: bash

        ewoksweb --port 6660

    Also by default, ``ewoksweb`` will save ewoks resources (workflows, tasks, icons) in the current folder. This can be changed through the ``--dir`` command line argument

    .. code:: bash

        ewoksweb --dir /path/to/ewoksserver/resources

Tutorials
---------

Follow the learning-oriented tutorials that will help accomplish a sequence of steps in order to:

.. toctree::
    :maxdepth: 1

    tutorials/create_your_first_workflow
    tutorials/create_a_task


How-to guides
-------------

The how-to guides are descriptions targeting the following tasks:

.. toctree::
    :maxdepth: 1

    howtoguides/new_open_save
    howtoguides/executing_a_workflow
    howtoguides/monitoring_executed_workflows

Explanations
------------

General useful information regarding:

.. toctree::
    :maxdepth: 1

    explanations/editor_basics
    explanations/embedded_nodes
    explanations/link_validation
    explanations/node_editing
    explanations/link_editing


Documentation of related projects:
----------------------------------

* `ewokscore <https://ewokscore.readthedocs.io/>`_ : create workflows and implement tasks
* `ewoksorange <https://ewoksorange.readthedocs.io/>`_ : create and execute workflows with a desktop GUI
* `ewoksppf <https://ewoksppf.readthedocs.io/>`_ : execute cyclic workflows
* `ewoksdask <https://ewoksdask.readthedocs.io/>`_ : parallelize workflow execution
* `ewoksjob <https://ewoksjob.readthedocs.io/>`_: distribute workflow execution
* `ewoksserver <https://ewoksserver.readthedocs.io/>`_: REST server to manage and execute workflows
* `ewoksutils <https://ewoksutils.readthedocs.io/>`_ : developer utilities
