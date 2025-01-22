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
pnpm build:package
pip install build
python -m build -s
```

## Release

Since `ewoksweb` is a companion package of `ewoksserver`, it is released as a
Python package on [PyPI](https://pypi.org/project/ewoksweb/).

To do a new release:

1. Checkout `main` and verify that your working tree is clean.
1. Edit the version in `pysrc/ewoksweb/__init__.py`
1. Commit the change and push it to `main`. The CI will trigger and build the
   package.

> If the CI fails, the package cannot be released. Try to relaunch it to see if
> it was a one-off failure (can happen with Cypress). If not, fix the CI first!

After the CI succeeded, go to the pipeline page: a manual CI job `release_pypi`
will be available.

1. Launch the `release_pypi` job to release the package on PyPI. A git tag will
   automatically be created with the version number.
1. Create a
   [Gitlab release](https://gitlab.esrf.fr/workflow/ewoks/ewoksweb/-/releases/new)
   out of the newly added tag
1. Write release notes in this release by using the
   [Compare page](https://gitlab.esrf.fr/workflow/ewoks/ewoksweb/-/compare) to
   gather the relevant changes since last release. Try to match the style of
   previous release notes.
1. Add the PyPI package link as _Release assets_ and click on _Create release_

Congratulations, the release is done 😎!

## Documentation

The documentation is composed of RST files located in `doc`. You can look at the
[Sphinx doc](https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html)
for information on how to write RST files.

If a new file is created, don't forget to reference it in one of the `toctree`
directive.

## Build documentation

The documentation is built with [Sphinx](https://www.sphinx-doc.org/en/master/)
that generates HTML pages out of the RST files. The configuration of Sphinx is
in `doc/conf.py`.

Requirements (including Sphinx) can be installed with

```bash
pip install [--user] .[doc]
```

Then, build the documentation with

```bash
sphinx-build doc build/sphinx/html -E -a
```

The generated HTML pages will be available in `build/sphinx/html`. You can
browse them by opening `build/sphinx/html/index.html` in your browser.

When developing/writing doc,
[sphinx-autobuild](https://github.com/executablebooks/sphinx-autobuild) can be
used to automatically rebuild the documentation on changes

```
sphinx-autobuild doc build/sphinx/html
```

The dynamic build will then be served on http://127.0.0.1:8000/.
