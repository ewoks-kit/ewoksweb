"""rm -rf doc/_generated/; sphinx-build doc build/sphinx/html -E -a
"""

from pysrc.ewoksweb import __version__ as release

project = "ewoksweb"
version = ".".join(release.split(".")[:2])
copyright = "2023-2024, ESRF"
author = "ESRF"
docstitle = f"{project} {version}"

extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.autosummary",
    "sphinx.ext.viewcode",
]

templates_path = ["_templates"]
exclude_patterns = []

html_theme = "pydata_sphinx_theme"

html_theme_options = {
    "icon_links": [
        {
            "name": "gitlab",
            "url": "https://gitlab.esrf.fr/workflow/ewoks/ewoksweb",
            "icon": "fa-brands fa-gitlab",
        },
    ],
    "navbar_start": ["navbar_start"],
    "footer_start": ["copyright"],
    "footer_end": ["footer_end"],
}

html_static_path = []

autosummary_generate = True
autodoc_default_flags = [
    "members",
    "undoc-members",
    "show-inheritance",
]