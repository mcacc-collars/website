/**
 * This cloudflare worker is called by "routes" for URLs that should return 410
 * (Gone).
 * 
 * I use /docs/_redirects to return 301 (permanent) redirects for months. But,
 * some crawlers never stop checking until they receive 410-gone. This worker is
 * for that. Just create a route to this worker, and it returns a simple text
 * 410-gone. You don't have to do anything else.
 * 
 * I added the ability to return an html page (with a link suggesting where a
 * human visitor should go. I.e., where you 301-perm redirected to for a
 * reasonable amouny of time before escalating to 401-gone.). This is optional.
 * If you don't define the gonePath below, then the text 410-gone is returned.
 */
export default {
  async fetch(request) {
  const url = new URL(request.url);
  
  /* OPTIONAL
   * To return an HTML 410 PAGE (with link to new page) for human visitors, add:
   *
   *   1. The gone path.
   *   2. The suggested/new path (the path you probably 301 redirected to for
   *      a while).
   *   3. The hostname displayed with the link. */
  const gonePaths = [
    '/donors',
    '/donors/',
    '/shelter',
    '/shelter/',
    '/resources/leash_sleeve',
    '/resources/leash_sleeve/',
    '/resources/leash_sleeve/template',
    '/resources/leash_sleeve/template/',
    '/resources/collars_leashes',
    '/resources/collars_leashes/',
    '/resources/collars_leashes/lk1900bn',
    '/resources/collars_leashes/lk1900bn/',
    '/resources/collars_leashes/lk1900bn/bobbin-winder/',
    '/resources/collars_leashes/lk1900bn/bobbin-winder/'];

  const suggestPaths = [
    '/',
    '/',
    '/',
    '/',
    '/resources/leash-sleeve/',
    '/resources/leash-sleeve/',
    '/resources/leash-sleeve/template/',
    '/resources/leash-sleeve/template/',
    '/resources/collars-leashes/',
    '/resources/collars-leashes/',
    '/resources/collars-leashes/lk1900bn/',
    '/resources/collars-leashes/lk1900bn/',
    '/resources/collars-leashes/lk1900bn/bobbin-winder/',
    '/resources/collars-leashes/lk1900bn/bobbin-winder/'];
  
  const displayHost = 'www.mcacc-collars.charity'; // displays in output html
  
  /* You don't have to do the above. If the path routed to this worker isn't
   * defined above, then a simple text 310-gone is returned.
   * END OPTIONAL */

/* PROCESSING
 * Get the index of the path if it exists in gonePaths. If it exists, return
 * 410-gone as an html page providing a link to where a human visitor should 
 * go.
 * 
 * This is just a nicer version of 410-gone. If you don't add the paths to 
 * gonePaths, a text 410-gone is returned. If you already redirected the gone
 * path with 301-permanent for a reasonable amount of time, there shouldn't be
 * human visitors by the time you send 410-gone. This is just an option. */
  let idx = gonePaths.indexOf(url.pathname)

  if (idx >= 0) {
    const html = `<!DOCTYPE html>
      <html>
      <head><title>410-Page gone</title></head>
      <body>
        <h1>Gone (410)</h1>
        <p>The requested URL "${url.pathname}" has been permanently removed or renamed.<br><br>
        Please update your bookmarks with the new location: <a href="${suggestPaths[idx]}">${displayHost}${suggestPaths[idx]}</a></p>
      </body>
      </html>`;

    return new Response(html, {
      status: 410,
      statusText: "Gone",
      headers: {
        "content-type": "text/html;charset=UTF-8",
        "Cache-Control": "public, max-age=604800", // Cache the 410 response so bots don't hit your Worker repeatedly
        "X-Robots-Tag": "noindex",
      },
    });
  };

  /* Otherwise, return a simple text 410 response. (You don't have to define
   * any gonePaths above. Just route a path to this worker and this happens.) */
  return new Response("410 Gone - This resource has been permanently removed.", {
    status: 410,
    statusText: "Gone",
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=604800", // Cache the 410 response so bots don't hit your Worker repeatedly
      "X-Robots-Tag": "noindex",
    },
  });

  },
};
