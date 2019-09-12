// https://developers.google.com/drive/api/v3/quickstart/nodejs


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('./dist/googleDriveCredentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), listFiles);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}

/**********************************
CASBAH = Contract Admin System + Be Architectural Heroes
Copyright (c) 2018, 2019 Andrew Siddeley
MIT License
********************************/

const FS = require("fs")
const FSP = require("fs-plus")
const PATH = require("path")
//const DRR=require("./DRRschema")
const BRANCH=PATH.join("reports", "deficiency reviews")
const CASITE=PATH.join(global.appRoot, global.casite)


const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

////////////////////////////////
//Resolvers
//function names relate to queryField names
exports.resolvers={

	drrIds(projectId){
		console.log("drrId resolver...", projectId)
		//drrId are the folder names 
		//read datafile within each folder
		var ids=[]

		try {
			var p=PATH.join(CASITE, projectId, BRANCH)
			ids=FS.readdirSync(p).filter(function (file) {
				return FS.statSync(PATH.join(p,file)).isDirectory()
			})			
		} catch(e) {
			console.log("Error...", e)
		}
		return ids		
	},
	
	drrHead(projectId, drrId){
		console.log("drrHead resolver...")
		var data
		try {
			var p=PATH.join(CASITE,	projectId, BRANCH, drrId, FILENAME_HEAD)
			console.log("trying FS.readFileSync...", p)
			data=JSON.parse(FS.readFileSync(p))
		} catch(e) {
			console.log("error:",e)
			//data={err:e, msg:"invalid projectId or drrId"}
			//testing only
			data=(new DrrHead(projectId, drrId)).getData()
		}
		return data
	},

	drrNotes(projectId, drrId){
		console.log("drrNotes resolver...")		
		var data
		try {
			var p=PATH.join(CASITE, projectId, BRANCH, drrId, FILENAME_NOTES)
			console.log("trying FS.readFileSync...", p)
			data=JSON.parse(FS.readFileSync(p))
		} catch(e) {
			console.log("error:",e)
			//data={err:e, msg:"invalid projectId or drrId"}
			//testing only
			data=(new DrrNote(projectId, drrId)).getData()
		}
		return data
	},

	createDrr(projectId){
		console.log("drrCreate resolver...")
		var	result
		try {
			var drr=new Drr(projectId, null)
			drr.serialize()
			result=drr.getOwn()
		} 
		catch(e){
			console.log("error:",e)	
			result={err:e}			
		}
		//return default data
		return result

	}
}


