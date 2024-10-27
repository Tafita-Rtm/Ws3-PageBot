const api = require('./api');

let storedText = "";  // Variable pour stocker le texte initial de l'utilisateur

const getLanguageButtons = async (send) => send({
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: "Sélectionnez la langue dans laquelle traduire votre message :",
        buttons: [
          {
            type: "postback",
            title: "Malagasy",
            payload: "MALAGASY"
          },
          {
            type: "postback",
            title: "Français",
            payload: "FRANCAIS"
          },
          {
            type: "postback",
            title: "Anglais",
            payload: "ANGLAIS"
          }
        ]
      }
    }
});

const listenMessage = async (event, pageAccessToken) => {
  const senderID = event.sender.id;
  const message = event.message.text;

  if (!senderID || !message) return;

  // Stocker le message de l'utilisateur
  storedText = message;

  const send = async text => api.sendMessage(senderID, typeof text === "object" ? text : {text}, pageAccessToken);
  
  // Afficher les options de langue
  await getLanguageButtons(send);
};

const translateText = async (text, language) => {
  // Appel à une API de traduction selon le langage (à implémenter)
  // Exemple de traduction simulée
  switch (language) {
    case "malagasy":
      return `Traduction en Malagasy : ${text}`;  // Remplacez par un appel réel
    case "francais":
      return `Traduction en Français : ${text}`;  // Remplacez par un appel réel
    case "anglais":
      return `Translation in English: ${text}`;  // Remplacez par un appel réel
    default:
      return text;
  }
};

const listenPostback = async (event, pageAccessToken) => {
  const senderID = event.sender.id;
  const postbackPayload = event.postback.payload.toLowerCase().trim();
  const send = async text => api.sendMessage(senderID, typeof text === "object" ? text : {text}, pageAccessToken);

  if (!senderID || !postbackPayload) return;

  // Traduire le texte stocké en fonction de la langue sélectionnée
  const translatedText = await translateText(storedText, postbackPayload);
  await send(translatedText);
};

module.exports = async (event, pageAccessToken) => {
  if (event.message) await listenMessage(event, pageAccessToken);
  else if (event.postback) await listenPostback(event, pageAccessToken);
};
