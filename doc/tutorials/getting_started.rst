Getting started
===============

.. code-block:: bash

    pip install ewoksweb

Start the app (frontend and server) via

.. code-block:: bash

    ewoksweb

The web app will be available at ``localhost:8000``.

.. note::

    ``ewoksweb`` takes the port 8000 by default. If there are other applications running on this port (e.g. iTunes radio on Mac), another port can be chosen

    .. code-block:: bash

        ewoksweb --port 6660

    Also by default, ``ewoksweb`` will save ewoks resources (workflows, tasks, icons) in the current folder. This can be changed through the ``--dir`` command line argument

    .. code-block:: bash

        ewoksweb --dir /path/to/ewoksserver/resources
