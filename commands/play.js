import { SlashCommandBuilder } from "@discordjs/builders";
import { QueryType } from "discord-player";
import { EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Searches for a song")
        .addStringOption((option) => option.setName("searchterms").setDescription("search keywords").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Plays a playlist from YT")
        .addStringOption((option) => option.setName("url").setDescription("url of playlist").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Plays a song from YT")
        .addStringOption((option) => option.setName("url").setDescription("url of song").setRequired(true))
    ),
  async execute({ client, interaction }) {
    if (!interaction.member.voice.channel) {
      await interaction.reply("You must be in a voice channel to use this command!");
    }

    const queue = await client.player.createQueue(interaction.member.voice.channel);

    if (!queue.connection) await queue.connect(interaction.member.voice.channel);

    let embed = new EmbedBuilder();

    if (interaction.options.getSubcommand() === "song") {
      let url = interaction.options.getString("url");

      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      if (!result.tracks.length) {
        await interaction.reply("no results found");
      }

      const song = result.tracks[0];

      await queue.addTrack(song);

      embed
        .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    } else if (interaction.options.getSubcommand() === "playlist") {
      let url = interaction.options.getString("url");

      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });

      if (!result.tracks.length) {
        await interaction.reply("no results found");
      }

      const playlist = result.playlist;

      await queue.addTracks(playlist);

      embed
        .setDescription(`Added **[${playlist.title}](${playlist.url})** to the queue.`)
        .setThumbnail(playlist.thumbnail)
        .setFooter({ text: `Duration: ${playlist.duration}` });
    } else if (interaction.options.getSubcommand() === "search") {
      let url = interaction.options.getString("searchTerms");

      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (!result.tracks.length) {
        await interaction.reply("no results found");
      }

      const song = result.tracks[0];

      await queue.addTrack(song);

      embed
        .setDescription(`Added **[${song}]** to the queue.`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    }

    if (!queue.playing) await queue.play();

    await interaction.reply({
      embeds: [embed],
    });
  },
};
