require('dotenv').config();
const axios = require('axios');
const { makeEnvelope } = require('./MakeEnvelope');
const { ApiClient, EnvelopesApi } = require('docusign-esign');

const sendTest = async () => {
  let envelope = makeEnvelope();
  //   console.log('Got envelope', JSON.stringify(envelope));

  // I'm too dang lazy to figure out my certificates right now
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  let apiClient = new ApiClient();
  apiClient.setBasePath('https://demo.docusign.net/restapi/');
  apiClient.addDefaultHeader(
    'X-DocuSign-Authentication',
    JSON.stringify({
      Username: process.env.USER_NAME,
      Password: process.env.PASSWORD,
      IntegratorKey: process.env.INTEGRATOR_KEY,
    })
  );
  let envelopesApi = new EnvelopesApi(apiClient);
  let results = null;

  results = await envelopesApi.createEnvelope(process.env.ACCOUNT_ID, { envelopeDefinition: envelope });
  let envelopeId = results.envelopeId;
  console.log(results);

  console.log(`Envelope was created. EnvelopeId ${envelopeId}`);

  envelopesApi.getDocument;
};

sendTest();
