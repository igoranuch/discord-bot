import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder().setName("exit").setDescription("Exits the voice channel"),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      await interaction.reply("There is no song playing");
      return;
    }

    queue.destroy();

    await interaction.reply("Why you bully me?");
  },
};
