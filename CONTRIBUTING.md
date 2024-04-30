# Contributing

## Quick start

```bash
pnpm install
pnpm start
```

To use all the features from ewoksweb, an instance of
[ewoksserver](https://ewoksserver.readthedocs.io) must be running locally on the
port 5000.

Such an instance can be installed and run by running

```bash
pip install ewoksserver
ewoks-server
```

Another `ewoksserver` instance (remote for example) can be used instead by
setting its URL through the env variable `VITE_SERVER_URL` in `.env.local`
(default: `http://127.0.0.1:8000`).

Similarly, the env variable `VITE_SERVER_API_SUFFIX` can be changed to request a
different version of the `ewoksserver` API. Ex:

- `/api` (default): requests the latest version
- `/api/v1`: requests the latest v1.x version
- `/api/v1.0.0`: requests a specific version (`1.0.0` in this case)

## Cypress tests

To run Cypress tests, the `ewoksweb` instance must be running (`pnpm start`) and
the `ewoksserver` instance must be configured appropriately to serve the test
resources:

```bash
ewoks-server --frontend-tests
```

Cypress tests can then be run with

```bash
pnpm cypress # in interactive GUI mode
# OR
pnpm cypress:run # to run all specs in CLI
```

## Build

Building the `ewoksweb` python package

```bash
pnpm build
python setup.py sdist
```

## Release

Since `ewoksweb` is a companion package of `ewoksserver`, it is released as a
Python package on [PyPI](https://pypi.org/project/ewoksweb/).

To do a new release:

1. Checkout `main` and verify that your working tree is clean.
1. Edit the version in `pysrc/ewoksweb/__init__.py`
1. Commit the change and push it to `main`
1. The CI will trigger and build the package.
1. After the CI succeeded, you have two choices:

- Either use
  [ewoksci deploy.sh](https://gitlab.esrf.fr/dau/ci/pyci/-/blob/main/scripts/deploy.sh)
  to upload the package
- Or download manually the package from the CI artifacts of the `assets` job and
  upload it with `twine`.
