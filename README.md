# CASBAH 
__C__ ontract __A__ dmin __S__ erver __B__ e __A__ rchitectural __H__ eroes
## Beta Version 0.1.4 to 0.9.9
Please note that casbah is still in it's beta stage of development with many features listed but not yet available.  The development team is working throughout the Summer of 2018 and expects to have a post-beta version ready for Autumn.  Thank you for your interest.

__Casbah__ is an open source web-server and site that helps manage documents and workflows for Architectural Contract Administrators. 

__Casbah__ works by maintaining a couple of folder structures in it's working directory.  The folder structures contain uploaded files as well as json files for storing data (Although casbah was initially built around a database this was dropped in favour of a strucuted file-system storage approach).  An  __uploads__ folder structure keeps incoming CA documents of varying types such as  drawings (pdf), GC billing (pdf), sketches(pdf), site photos (png, jpg).  Casbah also provides an efficient way of generating documents from folders containing templates and images, for an example see reports/site reviews.  A __wiki__ folder structure keeps searchable casbah help and support articles as well as user entries for anything related to casbah, such as notes, tips, lessons learned etc. 

__Casbah__ log-in and multiple users are not supported at this time.

## Installation
 
### npm (windows)
For installation with node package manager (npm), ensure nodejs and npm are installed on your computer. To create a new node project, open a cmd window and enter the following...
```
>mkdir my_casbah
>cd my_casbah
>npm init
```
Install casbah as a node_module in the project...
```
>npm install casbah --save
```
In the working directory, create a javascript file 'casbah_start.js' with the following content, this will be the server launcher.  You can copy this file from the node_modules/casbah folder.  Note how this file defines the __uploads__ and __wiki__ folder names.  These folders will be automatically created when casbah starts, if they don't already exist in the working directory.  
```
///// casbah_start.js /////
global.appRoot=__dirname
global.uploads_dir="my_projects"
global.wiki_dir="my_wiki"
require("casbah")
```
When casbah_start.js is in your working directory, launch it with node to start the server thus...
```
>node casbah_start
```
The casbah server should be running and serving on port 8080. Open your favorate browser and navigate to the casbah web-site at [http://localhost:8080/](http://localhost:8080/)

### git (windows)
Alternately, casbah can be installed with git directly from github.  Ensure git is installed on your computer, open a cmd window and enter following...
```
>git clone https://github.com/asiddeley/casbah.git
>cd casbah
>npm install
```
Once the casbah is cloned (and folder structure created), the casbah server can be launched like so...
```
>cd casbah
>npm run cas
```
The casbah server should be running and serving on port 8080.  Open your favorate browser and navigate to the casbah web-site at [http://localhost:8080/](http://localhost:8080/)

## Introduction
In Architectural practice, a building project goes through various phases from concept to construction.  Contact Administration (CA) is one of the latter phases and is the process of administering the contract between the Owner and Constructor to assist in getting the project built.  Casbah facilitates this process by managing the paperwork.  

Casbah is an open source web-server and site that helps manage documents and workflows for Architectural Contract Administrators. 

Casbah works by maintaining a couple of folder structures in it's working directory.  The folder structures contain uploaded files as well as json files for storing data (Although casbah was initially built around a database this was dropped in favour of a strucuted file-system storage approach).  An  __uploads__ folder structure keeps incoming CA documents of varying types such as  drawings (pdf), GC billing (pdf), sketches(pdf), site photos (png, jpg).  Casbah also provides an efficient way of generating documents from folders containing templates and images, for an example see reports/site reviews.  A __wiki__ folder structure keeps searchable casbah help and support articles as well as user entries for anything related to casbah, such as notes, tips, lessons learned etc. 

Casbah log-in and multiple users are not supported at this time.  
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
>git commit -m "brief summary of changes"
>git push
```
Then update the verion number and publish to npm as shown below.  A __patch__ increment is meant for the a small addition, correction or feature enhancement. A __minor__ increment is meant for the addition of a new feature. A __major__ increment it meant for a significant change, addition, or if the code breaks backward-compatibilty.
```
>npm version [major|minor|patch]
>npm publish
```
### license
Copyright 2008 Andrew I Siddeley

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.






