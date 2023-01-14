import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the current video"),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      await interaction.reply("There is no video playing");
      return;
    }

    const currentSong = queue.current;

    queue.setPaused(false);

    await interaction.reply({
      embeds: [
        new EmbedBuilder().setDescription(`Resumed **${currentSong.title}**`).setThumbnail(currentSong.thumbnail),
      ],
    });
  },
};
