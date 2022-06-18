"""rm -rf doc/_generated/; python setup.py build_sphinx -E -a
"""

project = "ewoksjob"
release = "0.1"
copyright = "2022, ESRF"
author = "ESRF"

extensions = []
templates_path = []
exclude_patterns = []

html_theme = "alabaster"
html_static_path = []

autosummary_generate = True
autodoc_default_flags = [
    "members",
    "undoc-members",
    "show-inheritance",
]
