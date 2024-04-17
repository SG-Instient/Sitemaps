//regex for adding cotation and comma to every line
// find - ^(.+)$ replace - "$1",

//regex to remove unwanted line space 
// find - \n\s*\n replace - \n

//regex to remove lines which have County-Cities
// find - .*County-Cities.* replace - empty

//regex to reomve line 3digit town names
// find - .*\w{3}-\w{4}-\w{2}\.html.* replace - empty

//regex to remove unwantes space from the begining and end of the line 
// find - ^\s+  replace - empty

// select the line and repeat the same line with : and ''
// find - ^(.+)$   replace - "$1":\n  "$1",
