const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  let prefix = client.config.prefix;
  
  if (!args[0]) {
    // This will turn the folder (category) into array.
    let module = client.helps.array();
    
    // This will hide a folder from display that includes "hide: true" in their module.json
    if (!client.config.owners.includes(message.author.id)) module = client.helps.array().filter(x => !x.hide);
    const embed = new Discord.MessageEmbed()
    .setAuthor("Help", client.user.displayAvatarURL({dynamic: true}))
    .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
    .setDescription(`**Type** \`m!help [command]\` **to get more specific information about a command.**`)
    
    for (const mod of module) {
      // You can change the .join(" | ") to commas, dots or every symbol.
      embed.addField(`${mod.name} (${mod.cmds.length})`, mod.cmds.map(x => `\`${x}\``).join(", "));
    }
    
    return message.channel.send(embed);
  } else {
    let cmd = args[0];
    
    // If the user type the [command], also with the aliases.
    if (client.commands.has(cmd) || client.commands.get(client.aliases.get(cmd))) {
      let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
      let name = command.help.name; // The command name.
      let desc = command.help.description; // The command description.
      let cooldown = command.conf.cooldown + " second(s)"; // The command cooldown.
      let aliases = command.conf.aliases.join(", ") ? command.conf.aliases.join(", ") : "No aliases provided.";
      let usage = command.help.usage ? command.help.usage : "No usage provided.";
      let example = command.help.example ? command.help.example : "No example provided.";
      
      let embed = new Discord.MessageEmbed()
      .setTitle(name)
      .setDescription(desc)
      .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
      .addField("Cooldown:", "`" + cooldown + "`")
      .addField("Aliases:", "`" + aliases + "`")
      .addField("Usage:", "`" + usage + "`")
      .addField("Example:", "`" + example + "`")
      
      return message.channel.send(embed);
    } else {
      // If the user type the wrong command.
      return message.channel.send({embed: { color: "RED", description: "```diff\n" + "Unknown command." + "```"}});
    }
  }
}

exports.help = {
  name: "help",
  description: "Show a command list.",
  usage: "m!help [command]",
  example: "m!help stats"
}

exports.conf = {
  aliases: ["?"],
  cooldown: 5
}