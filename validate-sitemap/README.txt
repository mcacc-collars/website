To validate the sitemap.xml file, run this command from within this directory:

	xmllint --noout --nonet --schema wrapper.xsd ../docs/sitemap.xml

That program won't retrieve the schemas used by the sitemap (they're downloaded into the schemas directory instead). The program can't be passed two schemas on the command line. (A wrapper schema was created to refer to them.).

I do it this way because I was unable to find an online sitemap validator that seemed real. (Many only check for well-formed xml, not compliance to the schema. Some check compliance to the schema, but don't report the details of an error. I couldn't find a good one.).
