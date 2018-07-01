# CASBAH 
## Contract Admin. Server *
### * Be Architectural Heroes 
#### ( beta version 0.1.x )
Casbah helps manage documents and workflows for Architectural Contract Administrators. 

## Installation (Windows)
 

### npm
Ensure nodejs and npm are installed on your computer. To create a new node project, open a cmd window and enter the following...
```
>mkdir my_casbah_site
>cd my_casbah_site
>npm init
```
Install casbah as a node_module in the project...
```
>npm install casbah --save
```
In the working directory, create a javascript file 'casbah_start.js' with the following content, this will be the launcher.  You can copy this file from the node_modules/casbah folder.
```
global.appRoot=__dirname
global.uploads_dir="my_projects"
global.wiki_dir="my_wiki"
require("casbah")
```
Once the casbah server is running, open your favorate browser and navegate to the casbah web-site...[http://localhost:8080/](http://localhost:8080/)



### git
Alternately casbah can be installed with git from github.  Ensure git is installed on your computer, open a cmd window and enter following...
```
>git clone https://github.com/asiddeley/casbah.git
>cd casbah
>npm install
>npm run cas
```



## Introduction
In Architectural practice, a project goes through various phases from concept to construction.  Contact Administration (CA) is one of the latter phases and is the process of administering the contract between the Owner and Constructor to get the project built.  Casbah facilitates this process by managing the paperwork.  

Casbah is a web-site that manages CA documents...

## Casbah Overview
Breakdown of the casbah main page and the 9 basic tabs follows...

### Action
This tab presents the action items, these are mainly taken from meeting minutes...
+ Action items
+ Projects
+ Index of all action folders

### Billing
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
+ Allowance Authorization Letters
+ Billing (GC progress draws)
+ Certificates of Payment
+ Progress Summary
+ Index of all billing folders

### Contract
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
+ Contract
+ Addendums
+ Bidders Q&A
+ Drawings
+ Specifications
+ Schedule
+ Change Contemplated
+ Change Directive
+ Change Order
+ Index of all contract folders

### Gallery
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
+ Gallery (featured photos)
+ Photos 
+ Sketchs
+ Index of all gallery folders


### Letters
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
+ Conformance Letters
+ Site Memos
+ Index of all letter folders

### Meetings
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
+ Action Items
+ OAC Meeting Minutes
+ Index of all meeting folders

### Reports
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
+ Site Visit Reports
+ Room Punch Lists
+ RFIs
+ Index of all report folders

### Submittals
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
+ Submittals
+ O & M Manuals
+ Index of all submittal folders

### Wiki
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
+ About
+ Help
+ Projects

## Development Notes
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Committing and Publishing 
After editing and testing code, use git to commit and update the repository... 
```
>git add .
>git commit -m 
>git push
```
Then update the verion number and publish to npm thus...
```
>npm version [major|minor|patch]
>npm publish
```
### license
Copyright 2008 Andrew I Siddeley

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.






