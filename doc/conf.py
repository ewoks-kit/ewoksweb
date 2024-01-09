"""rm -rf doc/_generated/; sphinx-build doc build/sphinx/html -E -a
"""

project = "ewoksweb"
version = "1.0"
copyright = "2023, ESRF"
author = "ESRF"

extensions = ["sphinx.ext.autodoc", "sphinx.ext.autosummary", "sphinx.ext.viewcode"]
templates_path = []
exclude_patterns = []

html_theme = "pydata_sphinx_theme"
html_theme_options = {
  "show_nav_level": 2
}
html_static_path = []

autosummary_generate = True
autodoc_default_flags = [
    "members",
    "undoc-members",
    "show-inheritance",
]
