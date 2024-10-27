const api = require('./api');
const commands = require('require-directory')(module, './commands');  // Charger les commandes du dossier

let storedText = "";  // Stocker le texte de l'utilisateur

const getLanguageButtons = async (send) => send({
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: "Sélectionnez la langue dans laquelle traduire votre message :",
        buttons: [
          { type: "postback", title: "Malagasy", payload: "malagasy" },
          { type: "postback", title: "Français", payload: "francais" },
          { type: "postback", title: "Anglais", payload: "anglais" }
        ]
      }
    }
});

const listenMessage = async (event, pageAccessToken) => {
  const senderID = event.sender.id;
  const message = event.message.text;

  if (!senderID || !message) return;

  // Stocker le message initial
  storedText = message;

  const send = async text => api.sendMessage(senderID, typeof text === "object" ? text : { text }, pageAccessToken);
  
  // Afficher les options de langue
  await getLanguageButtons(send);
};

const listenPostback = async (event, pageAccessToken) => {
  const senderID = event.sender.id;
  const payload = event.postback.payload.toLowerCase().trim();
  const send = async text => api.sendMessage(senderID, typeof text === "object" ? text : { text }, pageAccessToken);

  if (!senderID || !payload) return;

  // Exécuter la commande correspondante pour la langue sélectionnée
  const command = commands[payload];
  if (command && typeof command.run === "function") {
    await command.run({ api, event: { ...event, storedText }, send });
  } else {
    send("Commande non reconnue.");
  }
};

module.exports = async (event, pageAccessToken) => {
  if (event.message) await listenMessage(event, pageAccessToken);
  else if (event.postback) await listenPostback(event, pageAccessToken);
};
