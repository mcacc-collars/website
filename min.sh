#!/bin/bash
# *******************************************************************************
# This command will minify a src/file into its corresponding docs/file. (If the
# file is html, the <base element is removed too.).
#
# The script must be executed from the parent directory of /docs & /src. It
# prompts for which src file to minify. Or, you can pass any of the words
# seen there (the prompt) on the command line. Example:
#
#   ./min.sh html:resources (processes as if you chose "r")
#   ./min.sh r (processes as if you chose "r")
#
# Or, you can just pass the single character.
#
# IMPORTANT: This script calculates the sha256 hash for the <script> content. If
# that changes, you MUST update /docs/_headers with the new value. Also, change
# this script too, then re-run the script to finish the minimized file which was
# partially created in /docs.
#
# This script uses tdewolff's minify (https://github.com/tdewolff/minify/)
# command. Important for html: "--html-keep-whitespace" is not used. This can be
# a problem if used for other html files. (You have to investigate further if you
# use this command with other html files.).
# *******************************************************************************

# Check if we're in the correct directory (directories src/ and docs/ are present?)
if [ ! -d src/ ] || [ ! -d docs/ ]; then
	echo 'ERROR: src/ and docs/ subdirectories not found in current directory.'
fi

# Trap Ctrl+C and exit
trap 'echo -e "\nExiting menu..."; exit 0' SIGINT

bold=$(tput bold)
normal=$(tput sgr0)

# If a parm was passed, set choice to that. Otherwise, prompt for it.
if [ -n "$1" ]; then
	choice=$1 
else
	echo -e " html:\t$(tput smul)h$(tput sgr0)ome"
	echo -e "\t$(tput smul)f$(tput sgr0)iles"
	echo -e "\t$(tput smul)i$(tput sgr0)mages"
	echo -e "\t$(tput smul)r$(tput sgr0)esources"
	echo -e "\t\t$(tput smul)c$(tput sgr0)ollars"
	echo -e "\t\t\t$(tput smul)k$(tput sgr0)nife"
	echo -e "\t\t\tlk$(tput smul)1$(tput sgr0)900bn"
	echo -e "\t\t\t\t$(tput smul)w$(tput sgr0)inder"
	echo -e "\t\t$(tput smul)s$(tput sgr0)leeve"
	echo ""
	echo -e " css:\tfi$(tput smul)l$(tput sgr0)es\ts$(tput smul)t$(tput sgr0)yle"
	echo -e " js:\t$(tput smul)d$(tput sgr0)arkmode"
	echo ""

	read -p "h, f, i, r or c, k, 1, w, s or l, t, d or q to ${bold}q${normal}uit (default q): " choice
	
	echo ""
fi


# Map single-letter choice (or passed parm) to what's needed to build the command
# below.
case $choice in
	h | html:home)
		page='html:home'
		path='index.html'
	;;
	f | html:files)
		page='html:files'
		path='files/index.html'
	;;
	i | html:images)
		page='html:images'
		path='images/index.html'
	;;
	r | html:resources)
		page='html:resources'
		path='resources/index.html'
	;;

	c | html:collars)
		page='html:collars'
		path='resources/collars-leashes/index.html'
	;;
	k | html:knife)
		page='html:knife'
		path='resources/collars-leashes/hot-knife/index.html'
	;;
	1 | html:lk1900bn)
		page='html:lk1900bn'
		path='resources/collars-leashes/lk1900bn/index.html'
	;;
	w | html:winder)
		page='html:winder'
		path='resources/collars-leashes/lk1900bn/bobbin-winder/index.html'
	;;
	s | html:sleeve)
		page='html:sleeve'
		path='resources/leash-sleeve/index.html'
	;;

	l | css:files)
		page='css:files'
		path='css/files.css'
	;;
	t | css:style)
		page='css:style'
		path='css/style.css'
	;;
	
	d | js:darkmode)
		page='js:darkmode'
		path='js/darkmode.js'
	;;

	q)
		echo "Quitting."
		exit
	;;
	*)
		# If choice was empty, treat it as q
		if [ -z "$choice" ]; then
			echo "Quitting."
			exit
		fi
		
		echo "Unrecognized choice. Exiting."
		exit
	;;
esac


# Create the minify command. Note: If using these minify commands on other html
# files, it may be useful to add "--html-keep-whitespace'. Not using it (as I
# don't here) can break some layout. 
if [ ${page:0:4} = 'html' ]; then
	cmd="grep -v \"<base \" src/$path | minify --type html --html-keep-document-tags --html-keep-quotes > docs/${path}.TMP"

	# NOTE: this is the expected hash value from the docs/_headers file (for script_src). If this
	# value changes, it must be changed there too.
	sha256='sha256-rEaXJQujwFig9Fiflr+rVPy+GReId/T8HZe8r6+AzqE='

else
	cmd="minify src/$path > docs/${path}.TMP"
fi


# Confirm before executing.
echo "? CONFIRM: ${bold}$page${normal} (minify ${bold}src/$path${normal})"
echo "?"
echo "? Execute this command?"
echo "?"
echo "?   ${bold}$cmd${normal}"
echo ""

read -p "Confirm? y/n (default y): " choice

# If user pressed anything other than enter or "y", exit.
if [ ! -z "$choice" ] && [ $choice != "y" ]; then
	echo 'Canceled.'
	exit
fi


# Execute the command
set -o pipefail
eval "$cmd"

if [ "$?" -eq 0 ]; then
	echo '... minify command successful to .TMP file.'
else
	echo
	echo "ERROR: minify command ${bold}failed.${normal} .TMP file may exist."
	echo
	exit
fi


# For html, check if the sha (of the <script></script> content) changed
if [ ${page:0:4} = 'html' ]; then

	# This command extracts the content between <script></script>, calculates the
	# sha256 hash, and encodes it base64.
	cmd='perl -0777 -ne '\''while (/<script[^>]*>(.*?)<\/script>/gs) { print "$1"; }'\'' docs/${path}.TMP | openssl sha256 -binary | openssl base64'

	new_sha256=$(eval "$cmd")

	if [ "$?" -ne 0 ]; then
		echo
		echo "ERROR: command ${bold}failed${normal} calculating sha."
		echo "       .TMP file may exist."
		echo
		exit
	fi

	# add "sha256-" to the front of the base64 hash.
	new_sha256="sha256-${new_sha256}"

	# If the hash value changed, abort.
	if [[ "$new_sha256" != "$sha256" ]]; then
		echo
		echo "ABORT: script hash ($sha256) ${bold}changed:${normal} $new_sha256"
		echo "       .TMP file left in docs/ directory."
		echo
		exit
	fi

	echo '... sha matches.'

fi

# mv the .TMP file.
cmd="mv docs/${path}.TMP docs/${path}"
eval "$cmd"

if [ "$?" -ne 0 ]; then
	echo
	echo "ERROR: mv docs/${path}.TMP ${bold}failed.${normal}"
	echo
	exit
fi

echo "... .TMP file moved to docs/${path}. Done."

exit







