# Source html, css & js files (not minified)
This directory contains the website's source .html, .css & .js files. These files end up "minified" after editing. The minified version goes into the `/docs` directory (which Cloudflare Workers & Github Pages[1] uses as the source for static hosting). 

## HTML base element
These source .html files contain an `<base href="">` element which causes the browser to display images from `/docs`. This lets you edit these source files and view them in your browser as if they were in the actual site directory. (But, if you click anything, you'll then be in `/docs`.).

The base element is placed _after_ the css & java files are loaded. This allows those source files to be edited & tested from `/src` too. When the source file is minified, the base element is removed (the html files in `/docs` load _everything_ from `/docs`. This `/src` directory is only used for editing & viewing the un-minified source.). Note: placing the base element after the js & css isn't valid html (but, it's removed when the minified for actual use).

Remember: when viewing one of these .html files in your browser (to see how the edits render), if you follow a link to another page, that page will load from `/docs` (that's important to remember. If you were editing & testing the css or js source files. Those changes won't apply unless the page is loaded from `/src`.).

## Minification

I use [tdewolff's minify](https://github.com/tdewolff/minify/) command. Run the `min.sh` script (from this project's root directory). It will display more information about how to use it.

Important: the inline <script> is made csp safe with an sha256 hash in `/docs/_headers`. The minify script will alert if that changes. If it changes, you **must** change the hash value in `_headers` (and in the `min.sh` script). Then re-run minify. (It leaves a .TMP file which you can rename into .html and not have to re-run the command. Or, just re-run the command it will complete what was left undone.). If the hash changes, darkmode will stop working. Always use `min.sh` to create the .html files in `/docs`.

Note: for html files I use minify's `--html-keep-document-tags`. Without it, the inline script element loses its context at the start of <body>. That causes problems for darkmode. See the comments in that script. I also use `--html-keep-quotes` because I worry unquoted attr values might be too minified.).

--
[1] GitHub Pages uses `/docs`. Cloudflare Workers uses `/dist` by convention. I would like to use that (it's more semantic about the directory's purpose). But, then a custom workflow has to be used on Github Pages. It seems easier to tell Cloudflare Workers to use "/docs" in `/wrangler.jsonc`.

