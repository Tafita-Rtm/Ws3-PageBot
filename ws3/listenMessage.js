const api = require('./api');
const prefix = "";  // Pas de préfixe
let storedText = "";  // Texte stocké pour la traduction

// Chargement dynamique des commandes (langues)
const commands = await api.loadCommands();

// Affiche les options de langue
const getLanguageButtons = async (send) => send({
  attachment: {
    type: "template",
    payload: {
      template_type: "button",
      text: "Sélectionnez la langue dans laquelle vous voulez traduire votre message :",
      buttons: [
        { type: "postback", title: "Malagasy", payload: "malagasy" },
        { type: "postback", title: "Français", payload: "francais" },
        { type: "postback", title: "Anglais", payload: "anglais" }
      ]
    }
  }
});

// Gère les messages texte
const listenMessage = async (event) => {
  const senderID = event.sender.id;
  const message = event.message.text;

  if (!senderID || !message) return;

  // Stocke le message initial de l'utilisateur
  storedText = message;

  // Fonction d'envoi
  const send = async text => api.sendMessage(senderID, typeof text === "object" ? text : { text });

  // Affiche les boutons de sélection de langue
  await getLanguageButtons(send);
};

// Gère les clics sur les boutons de langue
const listenPostback = async (event) => {
  const senderID = event.sender.id;
  const payload = event.postback.payload.toLowerCase().trim();
  const send = async text => api.sendMessage(senderID, typeof text === "object" ? text : { text });

  if (!senderID || !payload) return;

  // Exécute la commande de traduction de la langue choisie
  const command = commands[payload];
  if (command && typeof command.run === "function") {
    await command.run({ text: storedText, send });
  } else {
    send("Désolé, cette langue n'est pas encore prise en charge.");
  }
};

// Fonction principale pour écouter les messages ou les postbacks
module.exports = async (event) => {
  if (event.message) await listenMessage(event);
  else if (event.postback) await listenPostback(event);
};
