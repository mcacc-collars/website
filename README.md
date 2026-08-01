# mcacc-collars website
How-to information for people who would like to make & donate collars, leashes, and "adopt me" leash sleeves for homeless dogs.

This site is hosted as [www.mcacc-collars.charity](https://www.mcacc-collars.charity), with mirrors at `mcacc-collars.github.io/website` (Github Pages) and `website.mcacc-collars.workers.dev` (Cloudflare Workers).

## Download
This website can be downloaded and browsed locally using your browser. Go to the repository [mcacc-collars/website](https://github.com/mcacc-collars/website) and look for the `<> Code` drop-down menu which contains a "download.zip" option. This is [the direct link](https://github.com/mcacc-collars/website/archive/refs/heads/main.zip) to download. The website is contained in the /docs directory.

## Directories explained
- `/docs` contains the working website. This is the directory to browse the site offline (start at `/docs/index.html`).

- `/src` contains the working (permanent) .html, .css & .js files (with comments, indentation). These end up in `/docs` as minified copies (the pages served to visitors - but the source not as human readable). 

    `/src` has a readme about how those files are minimized after editing & testing.

    The `/docs` directory contains most of the site's source (permanent files: images, .pdf & .zip files, the sitemap, etc.).

The html source files (`/src`) have a `<base href="">` element which allows them to display in your browser as if they were loaded from `/docs` (so images load normally). This allows easy editing & testing (viewing) in `/src`. The element is placed after the js & css directives. Those load from `/src`. (So, they can be edited and tested from `/src` too. All source editing and testing should be done from `/src`. Any other files in `/docs` can be edited there.).

# License
This project is licensed under the MIT License - see the LICENSE file for details. (This is the least restrictive license available.).
