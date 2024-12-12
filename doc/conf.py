from pysrc.ewoksweb import __version__ as release
from datetime import datetime

project = "ewoksweb"
version = ".".join(release.split(".")[:2])
copyright = f"2023-{datetime.now().year}, ESRF"
author = "ESRF"
docstitle = f"{project} {version}"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = []

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

templates_path = ["_templates"]

html_theme = "pydata_sphinx_theme"
html_static_path = ["_static"]
html_template_path = ["_templates"]
html_logo = "_static/logo.png"

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
    "logo": {
        "text": docstitle,
    },
    "footer_start": ["copyright"],
    "footer_end": ["footer_end"],
}
