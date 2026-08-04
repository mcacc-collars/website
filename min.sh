#!/bin/bash
# *******************************************************************************
# This command will minify a src/file into its corresponding docs/file. (If the
# file is html, the <base element is removed too.).
#
# The script prompts for which src file to minify. You can pass any of the words
# seen there on the command line. Example:
#
#  ./min.sh html:resources (processes as if you chose "r")
#  ./min.sh css:style (processes as if you chose "t")
#
# This script uses tdewolff's minify (https://github.com/tdewolff/minify/)
# command. Important, for html "--html-keep-whitespace" is not used. This can be
# a problem if used for other html files. (You have to investigate this if you
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

# If a parm was passed, set choice to that. Otherwise, promot for it.
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

	read -p "Type your choice, or q to ${bold}q${normal}uit (default q): " choice
	
	echo ""
fi


# Map single-letter choice (or passed parm) to the command to use.
case $choice in
	# Note: If using these commands on other html files, it may be useful to add:
	# '--html-keep-whitespace'. Not using it can break some layout (ex, "</a> <a" occur together.) 
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
		path='resources/collars-leashes/leash-sleeve/index.html'
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

# Create the command
if [ ${page:0:4} = 'html' ]; then
	cmd="grep -v \"<base \" src/$path | minify --type html --html-keep-document-tags --html-keep-quotes > docs/$path"
else
	cmd="minify src/$path > docs/$path"
fi

# Confirm before executing.
echo "! CONFIRM: ${bold}$page${normal} (minify ${bold}src/$path${normal})"
echo "!"
echo "! Execute this command?"
echo "!"
echo "!   ${bold}$cmd${normal}"
echo ""

read -p "Confirm? y/n (default n): " choice

# If the user pressed enter, or typed anything other than "y", exit.
if [ -z "$choice" ] || [ $choice != "y" ]; then
	echo 'Canceled.'
	exit
fi

# Execute the command
eval "$cmd"

if [ "$?" = 0 ]; then
	echo 'Command successful.'
else
	echo 'Command failed.'
fi

exit







