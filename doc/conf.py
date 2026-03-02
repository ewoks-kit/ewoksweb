# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

import importlib.metadata

release = importlib.metadata.version("ewoksweb")

project = "ewoksweb"
version = ".".join(release.split(".")[:2])
copyright = "2021-2026, ESRF"
author = "ESRF"
docstitle = f"{project} {version}"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    "sphinx_copybutton",
]

copybutton_prompt_text = r">>> |\.\.\. |\$ |In \[\d*\]: | {2,5}\.\.\.: | {5,8}: "
copybutton_prompt_is_regexp = True

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

templates_path = ["_templates"]

html_theme = "pydata_sphinx_theme"
html_title = docstitle
html_logo = "_static/logo.png"
html_static_path = ["_static"]
html_template_path = ["_templates"]
html_css_files = ["custom.css"]

html_theme_options = {
    "header_links_before_dropdown": 3,
    "navbar_align": "content",
    "show_nav_level": 2,
    "icon_links": [
        {
            "name": "github",
            "url": "https://github.com/ewoks-kit/ewoksweb",
            "icon": "fa-brands fa-github",
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
