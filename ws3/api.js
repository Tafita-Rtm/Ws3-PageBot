const axios = require("axios");
const fs = require("fs");
const cmdLoc = __dirname + "/commands";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || "EAASdkqwWhMsBO2iyezebDQMJZCL6tnembRvSDA4t0wW5mSaSTyCLvlxQswGBAv1pJNxPtfRZCZCZAeFWEvo92fWh3GZBY0ZAZBBTflei3C40upw7ZA8ZAygYhgZBZCceZClGgCG8tg2RSqk56wQBhnVPaXmnMVWxPzZC1NuuDbzZBolzxG55U94FdvIo5EJh60KCHsLrZApUgZDZD";

const api = {
  async sendMessage(senderId, message) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(`https://graph.facebook.com/v11.0/me/messages`, {
          recipient: { id: senderId },
          message
        }, {
          params: { access_token: PAGE_ACCESS_TOKEN },
          headers: { "Content-Type": "application/json" }
        });
        resolve(response.data);
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
        reject(error);
      }
    });
  },

  async loadCommands() {
    const commands = {};
    const files = fs.readdirSync(cmdLoc);
    files.forEach(file => {
      const command = require(`${cmdLoc}/${file}`);
      const commandName = file.replace(".js", "");
      commands[commandName] = command;
    });
    return commands;
  }
};

module.exports = api;
