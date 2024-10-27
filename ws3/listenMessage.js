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
            payload: "malagasy"
          },
          {
            type: "postback",
            title: "Français",
            payload: "francais"
          },
          {
            type: "postback",
            title: "Anglais",
            payload: "anglais"
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
  // Simulation de traduction (remplacez par une API de traduction si nécessaire)
  switch (language) {
    case "malagasy":
      return `Traduction en Malagasy : ${text}`;  // Simulez ici avec la vraie traduction
    case "francais":
      return `Traduction en Français : ${text}`;  // Simulez ici avec la vraie traduction
    case "anglais":
      return `Translation in English: ${text}`;  // Simulez ici avec la vraie traduction
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
