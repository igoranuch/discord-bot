import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current video"),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      await interaction.reply("There is no video playing");
      return;
    }

    const currentSong = queue.current;

    queue.skip();

    await interaction.reply({
      embeds: [
        new EmbedBuilder().setDescription(`Skipped **${currentSong.title}**`).setThumbnail(currentSong.thumbnail),
      ],
    });
  },
};
