import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("queue").setDescription("Shows the queue of 10 first songs"),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      await interaction.reply("There is no song playing");
      return;
    }

    const queueString = queue.tracks
      .slice(0, 10)
      .map((song, i) => `${i + 1}\) [${song.duration}]\ ${song.title} - <@${song.requestedBy.id}>`)
      .join("\n");

    const currentSong = queue.current;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `Currently Playing: ** \n\ ${currentSong.title} - <@${currentSong.requestedBy.id}>\n\n Queue:**\n${queueString}`
          )
          .setThumbnail(currentSong.thumbnail),
      ],
    });
  },
};
