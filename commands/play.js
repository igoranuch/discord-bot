import { SlashCommandBuilder } from "@discordjs/builders";
import { QueryType } from "discord-player";
import { EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a video")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Searches for a video")
        .addStringOption((option) => option.setName("searchterms").setDescription("search keywords").setRequired(true))
    )
    // .addSubcommand((subcommand) =>
    //   subcommand
    //     .setName("playlist")
    //     .setDescription("Plays a playlist from YT")
    //     .addStringOption((option) => option.setName("url").setDescription("url of playlist").setRequired(true))
    // )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("video")
        .setDescription("Plays a video from YT")
        .addStringOption((option) => option.setName("url").setDescription("url of video").setRequired(true))
    ),
  async execute({ client, interaction }) {
    if (!interaction.member.voice.channel) {
      await interaction.reply("You must be in a voice channel to use this command!");
    }

    const queue = await client.player.createQueue(interaction.member.voice.channel);

    if (!queue.connection) await queue.connect(interaction.member.voice.channel);

    let embed = new EmbedBuilder();

    if (interaction.options.getSubcommand() === "video") {
      let url = interaction.options.getString("url");

      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      if (!result.tracks.length) {
        await interaction.reply("No results found");
      }

      const video = result.tracks[0];

      await queue.addTrack(video);

      embed
        .setDescription(`Added **[${video.title}](${video.url})** to the queue.`)
        .setThumbnail(video.thumbnail)
        .setFooter({ text: `Duration: ${video.duration}` });
    }
    // else if (interaction.options.getSubcommand() === "playlist") {
    //   let url = interaction.options.getString("url");

    //   const result = await client.player.search(url, {
    //     requestedBy: interaction.user,
    //     searchEngine: QueryType.YOUTUBE_PLAYLIST,
    //   });

    //   if (!result.playlist) {
    //     await interaction.reply("No results found");
    //   }

    //   console.log(result);

    //   const playlist = result.playlist;

    //   console.log(playlist);

    //   await queue.addTracks(playlist);

    //   embed
    //     .setDescription(`Added **[${playlist.title}](${playlist.url})** to the queue.`)
    //     .setThumbnail(playlist.thumbnail)
    //     .setFooter({ text: `Duration: ${playlist.duration}` });
    // }
    else if (interaction.options.getSubcommand() === "search") {
      let searchTerms = interaction.options.getString("searchterms");

      const result = await client.player.search(searchTerms, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (!result.tracks.length) {
        await interaction.reply("No results found");
      }

      const video = result.tracks[0];

      await queue.addTrack(video);

      embed
        .setDescription(`Added **[${video.title}](${video.url})** to the queue.`)
        .setThumbnail(video.thumbnail)
        .setFooter({ text: `Duration: ${video.duration}` });
    }

    if (!queue.playing) await queue.play();

    await interaction.reply({
      embeds: [embed],
    });
  },
};
