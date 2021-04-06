require("dotenv").config({});
const mineflayer = require("mineflayer");
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

const channel = config.discord.channels.chat;
const host = config.minecraft.host;
const username = config.minecraft.username;
const password = config.minecraft.password;
const auth = config.minecraft.auth;

const bot = mineflayer.createBot({
  host: host, // Input server IP (should be hypixel.net)
  username: username, // Input username for minecraft account
  password: password, // Input password for minecraft account
  auth: auth, // Set to 'microsoft' if your account is migrated
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Hypixel guilds", { type: "WATCHING" });
  client.user.setStatus("dnd");
});

client.on("message", (msg) => {
  if (msg.author.bot) return;

  if (msg.content === config.prefix + "help") {
    msg.channel.send("do later or something");
  }
  if (msg.channel == channel) {
    bot.chat("/gc D > " + msg.member.displayName + ": " + msg.content);
  }
});

bot.on("messagestr", (message) => {
  if (!message.startsWith("Guild > ")) return;
  realMsg = message.slice(8);
  let index = realMsg.indexOf(":");
  let player = realMsg.substring(0, index);
  let msg = realMsg.substring(index + 1);

  if (!(player == username)) {
    if (msg.trim().toLowerCase().startsWith("!ping")) {
      ping = bot.player.ping;
      bot.chat("/gc Current ping: " + ping);
    } else {
      let messageEmbed = new Discord.MessageEmbed()
        .setTitle("New message:")
        .setDescription(msg)
        .setColor("#006400")
        .setTimestamp()
        .setFooter("https://mufin.live/")
        .setAuthor(
          player,
          "https://www.mc-heads.net/avatar/" + player,
          "https://plancke.io/hypixel/player/stats/" + player
        );
      client.channels.cache.get(channel).send(messageEmbed);
    }
    console.log("--------------------");
    console.log("Entire message: " + message);
    console.log("Player: " + player);
    console.log("Message:" + msg);
  }
});

bot.on("kicked", console.log);
bot.on("error", console.log);

client.login(process.env.TOKEN);
