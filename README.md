# Ewoks-web

Visualizer for [NetworkX](https://networkx.org/) task graphs in the
[node-link](https://networkx.org/documentation/stable/reference/readwrite/generated/networkx.readwrite.json_graph.node_link_data.html#networkx.readwrite.json_graph.node_link_data)
JSON format.

# From source

Start the frontend

```bash
npm start
```

Build the package for deployment on pypi

```bash
npm update
npm run build
python setup.py sdist
```

# From pypi

Install REST server only (`ewoksserver` is another package)

```bash
pip install ewoksserver
```

Install REST server with frontend (`ewoksserver` has `ewoksweb` as optional
dependency)

```bash
pip install ewoksserver[frontend]
```

or alternatively

```bash
pip install ewoksserver
pip install ewoksweb
```

Start the server that serves the frontend

```bash
ewoks-server
```
