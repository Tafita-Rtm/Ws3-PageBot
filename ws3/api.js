const axios = require("axios");
const fs = require("fs");
const cmdLoc = __dirname + "/commands";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || "EAASdkqwWhMsBO5lKsUMqCjS5FvraTJyWTsuIZCZCol4ZBce08fl17igtPfQ2DJCiDWe5sprrKR7Ij6fh1wDLYX3iKUQwUdoWuerR1DiXysjtEQn8gw6dntQ8ZCgZB87NMB4pguaWYyxZApQhid0wZAsjV0x6ZAOMTiWx4Up9ZBXQYStgcRxyDZBoNZBioJefgUQWeEjjAZDZD";

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
