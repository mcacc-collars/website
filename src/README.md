# Source html, css & js files (not minified)
This directory contains the website's source .html, .css & .js files. These files end up being "minified" after editing. The minified version goes into the `/docs` directory (which Cloudflare Workers & Github Pages[1] uses as the source for static hosting). 

## HTML base element
These source .html files contain an `<base href="">` element which causes the browser to display the images from `/docs`. This lets you edit these source files and easily view them in your browser as if they were in the real site directory. (But, if you click anything, you'll then be in `/docs`.).

The base element is placed _after_ the css & java files are loaded. This allows those source files to be edited & tested from `/src` too. When the source file is minified, the base element is removed (the html files in `/docs` load _everything_ from `/docs`. This `/src` directory is only used for editing & viewing the un-minified source.). Note: placing the base element after the js & css files causes an html validator error. It doesn't matter for this purpose. It's removed when the minified version is put in `/docs` to actually be used.

Remember: when viewing one of these .html files in your browser (to see how the edits render), if you follow a link to another page, that page will load from `/docs` (this is important to remember. If you were editing & testing the css or js source files. Those changes won't apply unless the page is loaded from `/src`.).

## Minification

I use [tdewolff's minify](https://github.com/tdewolff/minify/) command. Run the min.sh script in this project's root directory. It will display the command to use.

Note: for html files, I use minify's `--html-keep-document-tags`. Without it, the inline script element loses its context at the start of <body>. That causes problems for darkmode.js. See the comments in that script. I also use `--html-keep-quotes` because I worry unquoted attr values might be too minified.).

--
[1] GitHub Pages uses `/docs`. Cloudflare Workers uses `/dist` by convention. I would like to use that (it's more semantic about the directory's purpose). But, then a custom workflow has to be used on Github Pages. It seems easier to tell Cloudflare Workers to use "/docs" in `/wrangler.jsonc`.

