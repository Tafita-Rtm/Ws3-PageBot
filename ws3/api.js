const axios = require("axios");
const fs = require("fs");
const cmdLoc = __dirname + "/commands";
const commands = [];
const descriptions = [];

module.exports = {
  async loadCommands() {
    fs.readdir(cmdLoc, {}, async (err, files) => {
      for await (const name of files) {
        const readCommand = require(cmdLoc + "/" + name);
        const commandName = readCommand.name || name.replace(".js", "").toLowerCase();
        const description = readCommand.description || "No description provided.";
        commands.push(commandName);
        descriptions.push(description);
        console.log(`${commandName} loaded`);
      }
      console.log("Commands loaded successfully.");
    });
  },

  async sendMessage(senderId, message, pageAccessToken) {
    return await new Promise(async (resolve, reject) => {
      try {
        const sendMsg = await axios.post(`https://graph.facebook.com/v21.0/me/messages`, {
          recipient: { id: senderId },
          message
        }, {
          params: {
            access_token: pageAccessToken
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
        resolve(sendMsg.data);
      } catch (error) {
        console.error('Error sending message:', error);
        reject(error);
      }
    });
  }
};
