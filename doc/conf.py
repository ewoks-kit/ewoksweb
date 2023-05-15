"""rm -rf doc/_generated/; sphinx-build doc build/sphinx/html -E -a
"""

project = "ewoksweb"
version = "0.1"
copyright = "2022, ESRF"
author = "ESRF"

extensions = ["sphinx.ext.autodoc", "sphinx.ext.autosummary", "sphinx.ext.viewcode"]
templates_path = []
exclude_patterns = []

html_theme = "classic"
html_static_path = []

autosummary_generate = True
autodoc_default_flags = [
    "members",
    "undoc-members",
    "show-inheritance",
]
