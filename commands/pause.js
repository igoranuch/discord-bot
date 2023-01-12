import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the current song"),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      await interaction.reply("There is no song playing");
      return;
    }

    const currentSong = queue.current;

    queue.setPaused(true);

    await interaction.reply({
      embeds: [
        new EmbedBuilder().setDescription(`Paused **${currentSong.title}**`).setThumbnail(currentSong.thumbnail),
      ],
    });
  },
};
