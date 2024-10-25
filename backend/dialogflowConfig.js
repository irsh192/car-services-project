// backend/dialogflowConfig.js
const dialogflow = require('dialogflow');
const { v4: uuidv4 } = require('uuid');

const projectId = 'YOUR_PROJECT_ID'; // Replace with your Dialogflow project ID
const sessionId = uuidv4();

const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

module.exports = { sessionClient, sessionPath };
