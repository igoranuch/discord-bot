import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder().setName("leave").setDescription("Leaves the voice channel"),
  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    queue.destroy();

    await interaction.reply("Why you bully me?");
  },
};
