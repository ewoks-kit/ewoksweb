"""rm -rf doc/_generated/; sphinx-build doc build/sphinx/html -E -a
"""

project = "ewoksweb"
version = "1.0"
copyright = "2023, ESRF"
author = "ESRF"
docstitle = f"{project} {version}"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = ["sphinx.ext.autodoc", "sphinx.ext.autosummary", "sphinx.ext.viewcode"]
templates_path = []
exclude_patterns = []


autosummary_generate = True
autodoc_default_flags = [
    "members",
    "undoc-members",
    "show-inheritance",
]

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "pydata_sphinx_theme"
html_static_path = []
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
            "url": "https://pypi.org/project/ewoksserver/",
            "icon": "fa-brands fa-python",
        },
    ],
}
