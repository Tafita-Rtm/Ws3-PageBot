let activeCommand = null; // Variable pour stocker la commande active (ex: "ai", "gemini")

const listenMessage = async (event, pageAccessToken) => {
  const senderID = event.sender.id;
  const message = event.message.text;
  if (!senderID || !message) return;

  const send = async text => api.sendMessage(senderID, typeof text === "object" ? text : {text}, pageAccessToken);

  // Convertir le message en minuscule et supprimer les espaces au début et à la fin
  const normalizedMessage = message.toLowerCase().trim();

  // Commande spéciale pour activer une IA (ex : "ai", "chatgpt", "gemini")
  if (["ai", "chatgpt", "gemini"].includes(normalizedMessage)) {
    activeCommand = normalizedMessage; // Définir la commande active
    return send(`🟢 Mode ${activeCommand} activé ! Posez vos questions.`);
  }

  // Commande pour arrêter l'IA active
  if (normalizedMessage === "stop" || normalizedMessage === "help") {
    activeCommand = null; // Désactiver la commande active
    return send("🔴 Mode désactivé. Tapez une commande pour commencer ou utilisez 'help' pour voir les options.");
  }

  // Vérifier si une commande est activée
  if (activeCommand) {
    // Exécuter la logique de la commande active (par exemple, envoyer le message à l'IA)
    return handleActiveCommand(activeCommand, message, send);
  }

  // Code existant pour les autres commandes sans préfixe
  switch (normalizedMessage) {
    case "help": {
      return send("Liste des commandes disponibles : ai, chatgpt, gemini, stop.");
    }
    default: {
      return send("Commande non reconnue. Tapez 'help' pour voir les options.");
    }
  }
};

// Fonction pour gérer la commande active en mode continu
const handleActiveCommand = async (command, message, send) => {
  // Logique pour chaque IA (ici, simplifié)
  switch (command) {
    case "ai":
      return send(`🤖 AI : Vous avez dit "${message}" ? Voici ma réponse.`);
    case "chatgpt":
      return send(`🤖 ChatGPT : Vous avez dit "${message}" ? Voici ma réponse.`);
    case "gemini":
      return send(`🤖 Gemini : Vous avez dit "${message}" ? Voici ma réponse.`);
    default:
      return send("Erreur : Commande inconnue.");
  }
};
