# Source html, css & js files (not minified)
This directory contains the website's source .html, .css & .js files. These files end up being "minified" after editing. The minified version goes into the `/dist` directory (which Cloudflare Workers & Github Pages[1] uses as the source for their static hosting). 

## HTML base element
These source .html files contain a `<base href="">` element which causes the browser to display images from `/dist`. This lets you edit these source files and view them in your browser. The base element is _after_ the css & java files are loaded. So, those source files can be edited & tested from here too.

When the source file is minimized, the base element is removed. The html files loaded from `/dist` load _everything_ from `/dist`. (This directory is only used for editing & viewing the source.).

## Minification

These are the commands to minify the files:

### css
`minify src/css/style.css > dist/css/style.css`

`minify src/css/files.css > dist/css/files.css`

### js
`minify src/js/darkmode.js > dist/js/darkmode.js`

### html
`minify --html-keep-document-tags --html-keep-quotes --html-keep-whitespace src/index.html | grep -v "<base " > dist/index.html`

`minify --html-keep-document-tags --html-keep-quotes --html-keep-whitespace src/files/index.html | grep -v "<base " > dist/files/index.html`

`minify --html-keep-document-tags --html-keep-quotes --html-keep-whitespace src/images/index.html | grep -v "<base " > dist/images/index.html`

`minify --html-keep-document-tags --html-keep-quotes --html-keep-whitespace src/resources/index.html | grep -v "<base " > dist/resources/index.html`

`minify --html-keep-document-tags --html-keep-quotes --html-keep-whitespace src/resources/collars-leashes/index.html | grep -v "<base " > dist/resources/collars-leashes/index.html`

`minify --html-keep-document-tags --html-keep-quotes --html-keep-whitespace src/resources/collars-leashes/hot-knife/index.html | grep -v "<base " > dist/resources/collars-leashes/hot-knife/index.html`

`minify --html-keep-document-tags --html-keep-quotes --html-keep-whitespace src/resources/collars-leashes/lk1900bn/index.html | grep -v "<base " > dist/resources/collars-leashes/lk1900bn/index.html`

`minify --html-keep-document-tags --html-keep-quotes --html-keep-whitespace src/resources/collars-leashes/lk1900bn/bobbin-winder/index.html | grep -v "<base " > dist/resources/collars-leashes/lk1900bn/bobbin-winder/index.html`

`minify --html-keep-document-tags --html-keep-quotes --html-keep-whitespace src/resources/leash-sleeve/index.html | grep -v "<base " > dist/resources/leash-sleeve/index.html`

Those must be executed from the parent directory. I use [tdewolff's minify](https://github.com/tdewolff/minify/) command. (I intend to script the above eventually.).

--
[1] The `/dist` directory is also accessible as the alias `/docs` because GitHub Pages uses that directory name.

