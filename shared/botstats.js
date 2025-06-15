
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const os = require("os");

// Constants
const EMBED_COLORS = {
  BOT_EMBED: '#5865F2'
};
const SUPPORT_SERVER = process.env.SUPPORT_SERVER || null;
const DASHBOARD = {
  enabled: false,
  baseURL: ''
};

function timeformat(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

function stripIndent(str) {
  // Handle both template literal and regular string cases
  if (typeof str !== 'string') {
    // If it's a template literal call, handle the array format
    if (Array.isArray(str) && str.raw) {
      str = str.raw[0];
    } else {
      return '';
    }
  }
  return str.replace(/^\s+/gm, '');
}

/**
 * @param {import('discord.js').Client} client
 */
module.exports = (client) => {
  // STATS
  const guilds = client.guilds.cache.size;
  const channels = client.channels.cache.size;
  const users = client.guilds.cache.reduce((size, g) => size + g.memberCount, 0);

  // CPU
  const platform = process.platform.replace(/win32/g, "Windows");
  const architecture = os.arch();
  const cores = os.cpus().length;
  const cpuUsage = `${(process.cpuUsage().user / 1024 / 1024).toFixed(2)} MB`;

  // RAM
  const botUsed = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
  const botAvailable = `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`;
  const botUsage = `${((process.memoryUsage().heapUsed / os.totalmem()) * 100).toFixed(1)}%`;

  const overallUsed = `${((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2)} GB`;
  const overallAvailable = `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`;
  const overallUsage = `${Math.floor(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)}%`;

  let desc = "";
  desc += `❒ Total guilds: ${guilds}\n`;
  desc += `❒ Total users: ${users}\n`;
  desc += `❒ Total channels: ${channels}\n`;
  desc += `❒ Websocket Ping: ${client.ws.ping} ms\n`;
  desc += "\n";

  const embed = new EmbedBuilder()
    .setTitle("Bot Information")
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(desc)
    .addFields(
      {
        name: "CPU",
        value: `❯ **OS:** ${platform} [${architecture}]\n❯ **Cores:** ${cores}\n❯ **Usage:** ${cpuUsage}`,
        inline: true,
      },
      {
        name: "Bot's RAM",
        value: `❯ **Used:** ${botUsed}\n❯ **Available:** ${botAvailable}\n❯ **Usage:** ${botUsage}`,
        inline: true,
      },
      {
        name: "Overall RAM",
        value: `❯ **Used:** ${overallUsed}\n❯ **Available:** ${overallAvailable}\n❯ **Usage:** ${overallUsage}`,
        inline: true,
      },
      {
        name: "Node Js version",
        value: process.versions.node,
        inline: false,
      },
      {
        name: "Uptime",
        value: "```" + timeformat(process.uptime()) + "```",
        inline: false,
      }
    );

  // Buttons
  let components = [];
  const inviteURL = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;
  components.push(new ButtonBuilder().setLabel("Invite Link").setURL(inviteURL).setStyle(ButtonStyle.Link));

  if (SUPPORT_SERVER) {
    components.push(new ButtonBuilder().setLabel("Support Server").setURL(SUPPORT_SERVER).setStyle(ButtonStyle.Link));
  }

  if (DASHBOARD.enabled) {
    components.push(
      new ButtonBuilder().setLabel("Dashboard Link").setURL(DASHBOARD.baseURL).setStyle(ButtonStyle.Link)
    );
  }

  let buttonsRow = new ActionRowBuilder().addComponents(components);

  return { embeds: [embed], components: [buttonsRow] };
};
