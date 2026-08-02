# Source html, css & js files (not minified)
This directory contains the website's source .html, .css & .js files. These files end up being "minified" after editing. The minified version goes into the `/docs` directory (which Cloudflare Workers & Github Pages[1] uses as the source for static hosting). 

## HTML base element
These source .html files contain an `<base href="">` element which causes the browser to display the images from `/docs`. This lets you edit these source files and easily view them in your browser as if they were in the real site directory. (But, if you click anything, you'll then be in `/docs`.).

The base element is placed _after_ the css & java files are loaded. This allows those source files to be edited & tested from `/src` too. When the source file is minified, the base element is removed (the html files in `/docs` load _everything_ from `/docs`. This `/src` directory is only used for editing & viewing the un-minified source.). Note: placing the base element after the js & css files causes an html validator error. It doesn't matter for this purpose. It's removed when the minified version is put in `/docs` to actually be used.

Remember: when viewing a .html file in this directory (to see how the edits render) if you follow a link to another page, that page will load from `/docs` (this is important to remember. If you were editing & testing the css or js. Those changes won't apply unless the page is loaded from `/src`.).

## Minification

These are the commands to minify the files:

### css
`minify src/css/style.css > docs/css/style.css`

`minify src/css/files.css > docs/css/files.css`

### js
`minify src/js/darkmode.js > docs/js/darkmode.js`

### html
`grep -v "<base " src/index.html | minify --type html --html-keep-document-tags --html-keep-quotes > docs/index.html`

`grep -v "<base " src/files/index.html | minify --type html --html-keep-document-tags --html-keep-quotes > docs/files/index.html`

`grep -v "<base " src/images/index.html | minify --type html --html-keep-document-tags --html-keep-quotes > docs/images/index.html`

`grep -v "<base " src/resources/index.html | minify --type html --html-keep-document-tags --html-keep-quotes > docs/resources/index.html`

`grep -v "<base " src/resources/collars-leashes/index.html | minify --type html --html-keep-document-tags --html-keep-quotes > docs/resources/collars-leashes/index.html`

`grep -v "<base " src/resources/collars-leashes/hot-knife/index.html | minify --type html --html-keep-document-tags --html-keep-quotes > docs/resources/collars-leashes/hot-knife/index.html`

`grep -v "<base " src/resources/collars-leashes/lk1900bn/index.html | minify --type html --html-keep-document-tags --html-keep-quotes > docs/resources/collars-leashes/lk1900bn/index.html`

`grep -v "<base " src/resources/collars-leashes/lk1900bn/bobbin-winder/index.html | minify --type html --html-keep-document-tags --html-keep-quotes > docs/resources/collars-leashes/lk1900bn/bobbin-winder/index.html`

`grep -v "<base " src/resources/leash-sleeve/index.html | minify --type html --html-keep-document-tags --html-keep-quotes > docs/resources/leash-sleeve/index.html`

Those must be executed from the parent directory. I use [tdewolff's minify](https://github.com/tdewolff/minify/) command. (I intend to script the above eventually.).

It may be necessary to use the option `--html-keep-whitespace` if minify breaks layout when collapsing whitespace.

--
[1] GitHub Pages uses `/docs`. Cloudflare Workers more uses `/dist` by convention. I would like to use that (it sounds more semantic about the directory's purpose). But, then a custom workflow has to be used on Github Pages. It seems easier to tell Cloudflare Workers to use "/docs" in `/wrangler.jsonc`.

