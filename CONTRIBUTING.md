# Contributing

## Quick start

```bash
pnpm install
pnpm start
```

Ewoksweb requires an instance of
[ewoksserver](https://gitlab.esrf.fr/workflow/ewoks/ewoksserver) running. See
the instructions on the
[ewoksserver repo](https://gitlab.esrf.fr/workflow/ewoks/ewoksserver/-/blob/main/README.md)
to see how to set-up such an instance.

The URL to the instance can then be set locally through the env variable
`REACT_APP_SERVER_URL` in `.env.local` (default: `http://localhost:5000`).

## Cypress tests

To run Cypress tests, your local `ewoksserver` instance must be launched with
the config located at `pysrc/ewoksweb/tests/resources/config.py`.

Cypress tests can then be run with

```bash
pnpm cypress # in interactive GUI mode
# OR
pnpm cypress:run # to run all specs in CLI
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
  [ewoksci deploy.sh](https://gitlab.esrf.fr/workflow/ewoksadmin/ewoksci/-/blob/main/deploy.sh)
  to upload the package
- Or download manually the package from the CI artifacts of the `assets` job and
  upload it with `twine`.
