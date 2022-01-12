const {
  ApiClient,
  Document,
  EnvelopeDefinition,
  EnvelopesApi,
  Recipients,
  Signer,
  SignHere,
  InitialHere,
  Tabs,
  RecipientEvent,
  EnvelopeEvent,
  EventNotification,
  CustomFields,
} = require('docusign-esign');
const fs = require('fs');

const myRecipients = [
  { email: 'dean.runyan.ext@bayer.com', name: 'Dean Runyan' },
  { email: 'penvermillion@gmail.com', name: 'Dean Runyan the Second' },
];

function makeEnvelope() {
  // Read the file locally for now
  let docPdfBytes;
  docPdfBytes = fs.readFileSync('TestDoc1.pdf');

  // Create the envelope definition
  let env = new EnvelopeDefinition();
  env.emailSubject = 'This is a DocuSign Test';

  // Add a document
  let doc1 = new Document();
  let doc1b64 = Buffer.from(docPdfBytes).toString('base64');
  doc1.documentBase64 = doc1b64;
  doc1.name = 'My Really Cool Test Document'; // can be different from actual file name
  doc1.fileExtension = 'pdf';
  doc1.documentId = '1';
  //   doc1.fileFormatHint = 'Contract';

  // The order in the docs array determines the order in the envelope - I'm lazy so I just have one
  env.documents = [doc1];

  const signers = myRecipients.map((thisRecipient, recipientId) => {
    return {
      ...thisRecipient,
      recipientId: recipientId + 1,
      routingOrder: recipientId + 1,
      tabs: {
        signHereTabs: [
          SignHere.constructFromObject({
            anchorString: `recv${recipientId + 1}_sign`,
          }),
        ],
        initialHereTabs: [
          InitialHere.constructFromObject({
            anchorString: `recv${recipientId + 1}_init`,
          }),
        ],
      },
    };
  });

  let recipients = Recipients.constructFromObject({
    signers,
  });
  env.recipients = recipients;

  // Create some events so we can track progress
  let recipientEvent2 = RecipientEvent.constructFromObject({
    recipientEventStatusCode: 'Completed',
  });

  let envelopeEvent = EnvelopeEvent.constructFromObject({
    envelopeEventStatusCode: 'Completed',
  });

  let eventNotification = EventNotification.constructFromObject({
    url: process.env.CALLBACK_URL,
    requireAcknowledgment: false,
    envelopeEvents: [envelopeEvent],
    recipientEvents: [recipientEvent1, recipientEvent2],
    eventData: {
      version: 'restv2.1',
      format: 'json',
      includeData: ['custom_fields', 'recipients'],
    },
  });
  env.eventNotification = eventNotification;

  env.customFields = CustomFields.constructFromObject({
    textCustomFields: [
      { name: 'documentId', value: 'c2212506-d232-4cd0-b282-f3a79aa59349' },
      { name: 'documentType', value: 'Contract' },
    ],
  });
  // Request that the envelope be sent by setting |status| to "sent".
  // To request that the envelope be created as a draft, set to "created"
  env.status = 'sent';

  return env;
}

module.exports = { makeEnvelope };
