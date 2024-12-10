"""rm -rf doc/_generated/; sphinx-build doc build/sphinx/html -E -a
"""

from pysrc.ewoksweb import __version__ as release
from datetime import datetime

project = "ewoksweb"
version = ".".join(release.split(".")[:2])
copyright = f"2023-{datetime.now().year}, ESRF"
author = "ESRF"
docstitle = f"{project} {version}"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

always_document_param_types = True
autosummary_generate = True
autodoc_default_flags = [
    "members",
    "undoc-members",
    "show-inheritance",
]
extensions = [
    "sphinx.ext.autosummary",
    "sphinx.ext.viewcode",
]

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

templates_path = ["_templates"]
exclude_patterns = []

html_theme = "pydata_sphinx_theme"
html_static_path = []
html_template_path = ["_templates"]
html_sidebars = {"<page_pattern>": ["list", "of", "templates"]}

html_theme_options = {
    "header_links_before_dropdown": 3,
    "navbar_align": "content",
    "show_nav_level": 2,
    "icon_links": [
        {
            "name": "gitlab",
            "url": "https://gitlab.esrf.fr/workflow/ewoks/ewoksweb",
            "icon": "fa-brands fa-gitlab",
        },
        {
            "name": "pypi",
            "url": "https://pypi.org/project/ewoksweb/",
            "icon": "fa-brands fa-python",
        },
    ],
    "navbar_start": ["navbar_start"],
    "footer_start": ["copyright"],
    "footer_end": ["footer_end"],
}


autosummary_generate = True
autodoc_default_flags = [
    "members",
    "undoc-members",
    "show-inheritance",
]
