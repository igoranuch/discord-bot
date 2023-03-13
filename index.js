import * as dotenv from "dotenv";
dotenv.config();

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Player } from "discord-player";
import { Client, GatewayIntentBits, Collection } from "discord.js";

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates],
});

const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

commandFiles.forEach(async (file) => {
  const filePath = pathToFileURL(path.join(commandsPath, file));
  const command = await import(filePath);

  client.commands.set(command.default.data.name, command.default);
  commands.push(command.default.data.toJSON());
});

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

client.on("ready", () => {
  const guildIds = client.guilds.cache.map((guild) => guild.id);

  const rest = new REST({ version: "14" }).setToken(process.env.TOKEN);

  guildIds.forEach((guildId) => {
    rest
      .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), { body: commands })
      .then(() => {
        console.log("Successfully updated commands for guild" + guildId);
      })
      .catch(console.error);
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute({ client, interaction });
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: "An error occured while executing the command" });
  }
});

client.login(process.env.TOKEN);
