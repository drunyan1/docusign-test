require('dotenv').config();
const { ApiClient, EnvelopesApi } = require('docusign-esign');

// I'm too dang lazy to figure out my certificates right now
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const getTest = async () => {
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

  const document = await envelopesApi.getDocument(process.env.ACCOUNT_ID, 'aed4951a-c39b-4e35-8910-de39eb22a560', '1');
  console.log(document);
};

getTest();
