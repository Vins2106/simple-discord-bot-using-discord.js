//inti
const Client = require("discord.js")
const Discord = require("discord.js")
const client = new Discord.Client({disableMention: "all"})

//data
const db = require("quick.db")
const MessageEmbed = require("discord.js")
const moment = require('moment')
const { version: djsversion } = require('discord.js');
const { version } = require('./package.json');
const os = require('os');
const { getMember, formatDate } = require("./functions.js");
const { utc } = require('moment');
const ms = require('parse-ms');
const cheerio = require('cheerio');
const request = require('request');

//music
const bot = require("discord.js");
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const GOOGLE_API_KEY = process.env.YTAPI_KEY;
const youtube = new YouTube(GOOGLE_API_KEY);
const queue = new Map();
const Util = require("discord.js")


//prefix / token
const { default_prefix, TOKEN } = require("./datapack.json")

//ready
client.on("ready", () => {
  console.log(`${client.user.username}'s turn on'`)
});

//message
client.on("message", async message => {
  let prefix = await db.get(`prefix_${message.guild.id}`)
    if(prefix === null) prefix = default_prefix;
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
  client.user.setActivity(`${prefix}help`, {type: "PLAYING"});
  
  if (cmd === "prefix") {
    if(!message.member.hasPermission("ADMINISTRATOR")) 
      return message.channel.send('You don\'t have permission to use that.');

        if(!args[0]) return message.channel.send('Please provide a new prefix');

        if(args[1]) return message.channel.send('The prefix can\'t have two spaces');

        db.set(`prefix_${message.guild.id}`, args[0])

        message.channel.send(`Succesffully set new prefix to **${args[0]}**`)
    console.log(`${message.author.username} Use prefix command`)
    }
  
  if(cmd === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.messages.fetch({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    message.channel.send(`I purge **${deleteCount}** message!`).then(m => m.delete({
      timeout: 5000
    }))
    console.log(`${message.author.username} Use purge command`)
  }
  if(cmd === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.cache.map(r=>["ADMINISTRATOR"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    console.log(`${message.author.username} Use kick command`)

  }
  
  if(cmd === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.cache.map(r=>["ADMINISTRATOR"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
    console.log(`${message.author.username} Use ban command`)
  }
  if (cmd === "blush") {
    
    var blush = [
  "https://cdn.weeb.sh/images/B14JM8Qw-.gif",
  "https://cdn.weeb.sh/images/B1jfzIXDZ.gif",
  "https://cdn.weeb.sh/images/rkXur1ncz.gif"
];
    var rand = blush[Math.floor(Math.random() * blush.length)]
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(`${message.author.username}'s **Blush! UwU**'`)
    .setImage(rand)
    message.channel.send(embed)
    console.log(`${message.author.username} Use gif command`)
  }
  if (cmd === "dance") {
    
var dance = [
  "https://cdn.weeb.sh/images/H1pi_I7Pb.gif",
  "https://cdn.weeb.sh/images/HyejRdLXvW.gif",
  "https://cdn.weeb.sh/images/S1HvWlF4M.gif"
];
    var rand = dance[Math.floor(Math.random() * dance.length)]
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(`${message.author.username}'s **Dance! :dancer: **'`)
    .setImage(rand)
    message.channel.send(embed)
    console.log(`${message.author.username} Use gif command`)
  }
  if (cmd === "hug") {
    
var hug = [
  "https://cdn.weeb.sh/images/SyQ0_umD-.gif",
  "https://cdn.weeb.sh/images/H1ui__XDW.gif",
  "https://cdn.weeb.sh/images/BkFnJsnA-.gif"
]
    var user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if(!user) {
      return message.reply("Tag someone")
    }
    var rand = hug[Math.floor(Math.random() * hug.length)]
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(`${message.author.username}'s **Hug** ${user.username} UwU'`)
    .setImage(rand)
    message.channel.send(embed)
    console.log(`${message.author.username} Use gif command`)
    
  }
  if (cmd === "kiss") {
    
var hug = [
  "https://cdn.weeb.sh/images/SJ8I2Tuv-.gif",
  "https://cdn.weeb.sh/images/B1yv36_PZ.gif",
  "https://cdn.weeb.sh/images/rkFSiEedf.gif"
]
    var user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if(!user) {
      return message.reply("Tag someone")
    }
    var rand = hug[Math.floor(Math.random() * hug.length)]
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(`${message.author.username}'s **Kisses :kiss: ** ${user.username} :heart: '`)
    .setImage(rand)
    message.channel.send(embed)
    console.log(`${message.author.username} Use gif command`)
    
  }
  if (cmd === "bite") {
    
var bite = [
  "https://cdn.weeb.sh/images/rJAlbgXsb.gif",
  "https://cdn.weeb.sh/images/ByWuR1q1M.gif"
]
    var user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if(!user) {
      return message.reply("Tag someone")
    }
    var rand = bite[Math.floor(Math.random() * bite.length)]
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(`${message.author.username}'s **Bite** ${user.username} >_<  '`)
    .setImage(rand)
    message.channel.send(embed)
    console.log(`${message.author.username} Use gif command`)
    
  }
  if (cmd === "kill") {
    
var kill = [
  "https://cdn.weeb.sh/images/BJO2j1Fv-.gif",
  "https://cdn.weeb.sh/images/r11as1tvZ.gif",
  "https://cdn.weeb.sh/images/B1VnoJFDZ.gif",
  "https://cdn.weeb.sh/images/B1qosktwb.gif"
];
    var kata = [
      "OMG x_x",
      "oh my",
      "Savage!"
    ]
    var user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if(!user) {
      return message.reply("Tag someone")
    }
    var rand = kill[Math.floor(Math.random() * kill.length)]
        var say = kata[Math.floor(Math.random() * kata.length)]
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(`${message.author.username}'s **Killed** ${user.username} | ${say}`)
    .setImage(rand)
    message.channel.send(embed)
    console.log(`${message.author.username} Use gif command`)
  }
  if (cmd === "pat") {
    
    var cry = [
  "https://cdn.weeb.sh/images/H1s5hx0Bf.gif",
  "https://cdn.weeb.sh/images/B1SOzCV0W.gif",
  "https://cdn.weeb.sh/images/r1BlektwW.gif",
  "https://cdn.weeb.sh/images/BkaRWA4CZ.gif"
];
    var user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if(!user) {
      return message.reply("Tag someone")
    }
    var rand = cry[Math.floor(Math.random() * cry.length)]
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(`${message.author.username}'s **Pat** ${user.username} | UwU <3 `)
    .setImage(rand)
    message.channel.send(embed)
    console.log(`${message.author.username} use gif command`)
  }
  if (cmd === "botinfo") {
    const core = os.cpus()[0];
		const embed = new Discord.MessageEmbed()
			.setColor(message.guild.me.displayHexColor || 'BLUE')
			.addField('General', [
				`**❯ Client:** ${client.user.tag} (${client.user.id})`,
				`**❯ Servers:** ${client.guilds.cache.size.toLocaleString()} `,
				`**❯ Users:** ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
				`**❯ Channels:** ${client.channels.cache.size.toLocaleString()}`,
				`**❯ Creation Date:** ${utc(client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`,
				`**❯ Node.js:** ${process.version}`,
				`**❯ Version:** v${version}`,
				`**❯ Discord.js:** v${djsversion}`,
				'\u200b'
			])
			
			.setTimestamp();

		message.channel.send(embed);
    console.log(`${message.author.username} use botinfo command`)
  }
  if (cmd === "avatar") {
    let user;
  
  if (message.mentions.users.first()) {
    user = message.mentions.users.first();
  } else if (args[0]) {
    user = message.guild.members.cache.get(args[0]).user;
  } else {
    user = message.author;
  }
  
  let avatar = user.displayAvatarURL({size: 4096, dynamic: true});
  // 4096 is the new biggest size of the avatar.
  // Enabling the dynamic, when the user avatar was animated/GIF, it will result as a GIF format.
  // If it's not animated, it will result as a normal image format.
  
  const embed = new Discord.MessageEmbed()
  .setTitle(`${user.tag} avatar`)
  .setColor("RANDOM")
  .setDescription(`[Avatar URL of **<@${user.id}>**](${avatar})`)
  .setImage(avatar)
  
  return message.channel.send(embed);
}
  if (cmd === "userinfo") {
  
    const flags = {
	DISCORD_EMPLOYEE: 'Discord Employee',
	DISCORD_PARTNER: 'Discord Partner',
	BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
	BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
	HYPESQUAD_EVENTS: 'HypeSquad Events',
	HOUSE_BRAVERY: 'House of Bravery',
	HOUSE_BRILLIANCE: 'House of Brilliance',
	HOUSE_BALANCE: 'House of Balance',
	EARLY_SUPPORTER: 'Early Supporter',
	TEAM_USER: 'Team User',
	SYSTEM: 'System',
	VERIFIED_BOT: 'Verified Bot',
	VERIFIED_DEVELOPER: 'Verified Bot Developer'
};
      const member = message.mentions.members.last() || message.guild.members.cache.get() || message.member;
		const roles = member.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(role => role.toString())
			.slice(0, -1);
		const userFlags = member.user.flags.toArray();
		const embed = new Discord.MessageEmbed()
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setColor(member.displayHexColor || 'BLUE')
			.addField('User', [
				`**❯ Username:** ${member.user.username}`,
				`**❯ Discriminator:** ${member.user.discriminator}`,
				`**❯ ID:** ${member.id}`,
				`**❯ Flags:** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`,
				`**❯ Avatar:** [Link to avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
				`**❯ Time Created:** ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}`,
				`**❯ Status:** ${member.user.presence.status}`,
				`**❯ Game:** ${member.user.presence.game || 'Not playing a game.'}`,
				`\u200b`
			])
			.addField('Member', [
				`**❯ Highest Role:** ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}`,
				`**❯ Server Join Date:** ${moment(member.joinedAt).format('LL LTS')}`,
				`**❯ Hoist Role:** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
				`**❯ Roles [${roles.length}]:** ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles) : 'None'}`,
				`\u200b`
			]);
		return message.channel.send(embed);
    console.log(`${message.author.username} use userinfo command`)
	}
  
  if (cmd === "serverinfo") {
    const member = getMember(message, args.join(" "));
        const roles = member.roles.cache.filter(r => r.id !== message.guild.id).map(r => r).join(", ") || 'none';
      const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: '(╯°□°）╯︵ ┻━┻',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
	brazil: 'Brazil',
	europe: 'Europe',
	hongkong: 'Hong Kong',
	india: 'India',
	japan: 'Japan',
	russia: 'Russia',
	singapore: 'Singapore',
	southafrica: 'South Africa',
	sydeny: 'Sydeny',
	'us-central': 'US Central',
	'us-east': 'US East',
	'us-west': 'US West',
	'us-south': 'US South'
};

		const members = message.guild.members.cache;
		const channels = message.guild.channels.cache;
		const emojis = message.guild.emojis.cache;
  
   

		const embed = new Discord.MessageEmbed()
			.setDescription(`**Guild information for __${message.guild.name}__**`)
			.setColor('BLUE')
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.addField('General', [
				`**❯ Name:** ${message.guild.name}`,
				`**❯ ID:** ${message.guild.id}`,
				`**❯ Owner:** ${message.guild.owner.user.tag} (${message.guild.ownerID})`,
				`**❯ Region:** ${regions[message.guild.region]}`,
				`**❯ Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
				`**❯ Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
				`**❯ Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`,
				`**❯ Time Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
				'\u200b'
			])
			.addField('Statistics', [
				`**❯ Role Count:** ${roles}`,
				`**❯ Emoji Count:** ${emojis.size}`,
				`**❯ Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
				`**❯ Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
				`**❯ Member Count:** ${message.guild.memberCount}`,
				`**❯ Humans:** ${members.filter(member => !member.user.bot).size}`,
				`**❯ Bots:** ${members.filter(member => member.user.bot).size}`,
				`**❯ Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`,
				`**❯ Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
				`**❯ Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
				'\u200b'
			])
			.addField('Presence', [
				`**❯ Online:** ${members.filter(member => member.presence.status === 'online').size}`,
				`**❯ Idle:** ${members.filter(member => member.presence.status === 'idle').size}`,
				`**❯ Do Not Disturb:** ${members.filter(member => member.presence.status === 'dnd').size}`,
				`**❯ Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
				'\u200b'
			])
			.addField(`Roles:`, `${message.guild.roles.cache.map(role => role.toString()).join(' ')}`)
			.setTimestamp();
		message.channel.send(embed);
    console.log(`${message.author.username} use serverinfo command`)
	}
  
  if (cmd === "image") {
    const search = args.join(" ")
    if (!search)
      return message.reply("Please enter something for search image");
        var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + `${search}`,
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };





    request(options, function(error, response, responseBody) {
      
        if (error) {
            return;
        }
  
 
        $ = cheerio.load(responseBody); 
 

        var links = $(".image a.link");
 
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
        
        console.log(urls);

        if (!urls.length) {
           
            return;
        }
 
        // Send result
      const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .addField(`Result for`, `${search}`, true)
      .setImage(`${urls[Math.floor(Math.random() * urls.length)]}`)
      .setTimestamp()
        message.channel.send(embed);
      
    });

  }
  
});

//help
client.on("message", async message => {
  let prefix = await db.get(`prefix_${message.guild.id}`)
    if(prefix === null) prefix = default_prefix;
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
  
  if (cmd === "help") {
    const embed = new Discord.MessageEmbed()
    .setTitle(":tools: Available Command :tools:")
    .setColor("RANDOM")
    .addField(":musical_note: Music", `
✥ join
✥ play
✥ search
✥ skip
✥ resume
✥ pause
✥ stop
✥ volume
✥ queue
✥ nowplaying
✥ loop`, true)
    .addField(":performing_arts: Gif", `
✥ kiss [tag]
✥ blush
✥ dance
✥ hug [tag]
✥ kill [tag]
✥ bite [tag]
✥ pat [tag]`, true)
    .addField(":information_source: Information", `
✥ userinfo
✥ botinfo
✥ serverinfo
✥ avatar [can tag]`, true)
    .addField(":yen: Simple economy", `
✥ bomco
✥ work
✥ deposit
✥ withdraw`, true)
    .addField(":wrench: Admin", `
✥ purge [amount]
✥ ban [tag] [reason]
✥ kick [tag] [reason]`, true)
    .addField(":mag_right: image search", `
✥ image [image]`, true)
    .addField("Other", `
✥ invite
✥ defaultprefix: \`${default_prefix}\`
✥ serverprefix: \`${prefix}\``, true)
    .addField(":gear: Setting", `
✥ prefix [new prefix]`, true)
    .setTimestamp()
    .setFooter("This message will automatically be deleted in 15 seconds | need help about command? join support server: https://discord.gg/FmNUE7s")
    message.channel.send(embed).then(m => m.delete({
      timeout: 15000
    }))
    console.log(`${message.author.username} Use Help command`)
  }
  if (cmd === "invite") {
    const embed = new Discord.MessageEmbed()
    .setTitle("Invite Link")
    .setColor("RANDOM")
    .addField("Link:", `
[Click Me](https://discord.com/api/oauth2/authorize?client_id=739842670079246347&permissions=8&scope=bot)`, true)
    .setFooter("This message will automatically be deleted in 10 seconds")
    .setTimestamp()
    message.channel.send(embed).then(m => m.delete({
      timeout: 10000
    }))
    console.log(`${message.author.username}'s use invite command'`)
    
  }
  if (cmd === "defaultprefix" || cmd == "dp") {
    message.reply(`My default prefix is: \`${default_prefix}\``)
    console.log(`${message.author.username}'s use default prefix command'`)
  }
  if (cmd === "serverprefix" || cmd == "sp") {
    message.reply(`My prefix ${message.guild.name} server is: \`${default_prefix}\``)
    console.log(`${message.author.username}'s use server prefix command'`)
  }
});

//economy
client.on("message", async message => {
  let prefix = await db.get(`prefix_${message.guild.id}`)
    if(prefix === null) prefix = default_prefix;
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
  
  if (cmd === "bomco") {
    let co = db.get(`bomco.${message.author.id}.coin`)
    if (!co) co = 0;
    let cobank = db.get(`cobanks.${message.author.id}.bank`)
    if (!cobank) cobank = 0;
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .addField("Total Bomco", `
💴 ${co}`, true)
    .addField("Total Bomco in bank", `
💴 ${cobank}`, true)
    .setFooter(`Need help about command?
join support server: https://discord.gg/FmNUE7s`)
    .setTimestamp()
    .setThumbnail(message.author.displayAvatarURL())
    message.channel.send(embed)
  }
  
  if (cmd === "work") {
    let user = message.author;
        let timeout = 10000;
        let author = await db.fetch(`worked_${message.guild.id}_${user.id}`);
    
    
    

        if(author !== null && timeout - (Date.now() - author) > 0){
          let time = ms(timeout - (Date.now() - author));
          const wk = new Discord.MessageEmbed()
          .setTitle("COOLDOWN")
          .setColor("RANDOM")
          .setDescription(`${user}, You can't work before ${time.seconds}s`)
          return message.channel.send(wk)
        } else {
            let amount = Math.floor(Math.random() * 1000) + 500;
            db.add(`bomco.${message.author.id}.coin`, amount)
            db.set(`worked_${message.guild.id}_${user.id}`, Date.now())

            const hasil = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`You work and earned 💴 ${amount}`)
            .setTimestamp()
            message.channel.send(hasil)
        }
  }
  
  if (cmd === "deposit") {

    let balance = db.get(`account.${message.author.id}.balance`);
    let amount = (args.join(" "))
    if (!amount) return message.channel.send("Please input a credits that you want to deposit it.");
    if (isNaN(amount)) return message.channel.send("Please input a valid number.");
    // isNaN = is Not a Number.

    if (!balance || balance == 0) return message.channel.send("Your coin is empty.");
    if (amount > balance) return message.channel.send("You don't have an enough credits to deposit. That is way too much.");
    if (amount === 0) return message.channel.send("you cannot deposit with an amount of 0 coins");

    await db.add(`cobanks.${message.author.id}.bank`, amount);
    await db.subtract(`bomco.${message.author.id}.coin`, amount);

    return message.channel.send(`You've been deposit :yen: **${amount}** coin to your bank!`);
}
    if (cmd === "withdraw") {

    let bank = db.get(`account.${message.author.id}.bank`);
    let amount = (args.join(" "))
    if (!amount) return message.channel.send("Please input a credits that you want to withdraw it.");
    if (isNaN(amount)) return message.channel.send("Please input a valid number.");
    // isNaN = is Not a Number.
    if (!bank || bank == 0) return message.channel.send("Your coin in bank is empty.");
    if (amount > bank) return message.channel.send("You don't have an enough credits to withdraw. That is way too much.");
    if (amount === 0) return message.channel.send("you cannot deposit with an amount of 0 coins");

    await db.add(`bomco.${message.author.id}.coin`, amount);
    await db.subtract(`cobanks.${message.author.id}.bank`, amount);

    return message.channel.send(`You've been withdraw :yen: **${amount}** coin to your wallet!`);
}
  
});

client.on("message", async (message) => {

    let prefix = await db.get(`prefix_${message.guild.id}`)
    if(prefix === null) prefix = default_prefix;
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const searchString = args.slice(1).join(" ");
    const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
    const serverQueue = queue.get(message.guild.id
    
                                 );
  if (command === "join") {
    const voiceChannel = message.member.voice.channel;
    var connection = await voiceChannel.join();
    message.reply("Succes join the voice channel")
  }
    if (command === "play" || command === "p") {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send("I'm sorry, but you need to be in a voice channel to play a music!");
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) {
            return message.channel.send("Sorry, but I need a **`CONNECT`** permission to proceed!");
        }
        if (!permissions.has("SPEAK")) {
            return message.channel.send("Sorry, but I need a **`SPEAK`** permission to proceed!");
        }
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
            }
            return message.channel.send(`<:yes:591629527571234819>  **|**  Playlist: **\`${playlist.title}\`** has been added to the queue`);
        } else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    var video = await youtube.getVideoByID(videos[0].id);
                    if (!video) return message.channel.send("🆘  **|**  I could not obtain any search results");
                } catch (err) {
                    console.error(err);
                    return message.channel.send("🆘  **|**  I could not obtain any search results");
                }
            }
            return handleVideo(video, message, voiceChannel);
        }
    }
    if (command === "search" || command === "sc") {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send("I'm sorry, but you need to be in a voice channel to play a music!");
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) {
            return message.channel.send("Sorry, but I need a **`CONNECT`** permission to proceed!");
        }
        if (!permissions.has("SPEAK")) {
            return message.channel.send("Sorry, but I need a **`SPEAK`** permission to proceed!");
        }
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
            }
            return message.channel.send(`<:yes:591629527571234819>  **|**  Playlist: **\`${playlist.title}\`** has been added to the queue`);
        } else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    let embedPlay = new Discord.MessageEmbed()
                        .setColor("BLUE")
                        .setAuthor("Search results", message.author.displayAvatarURL())
                        .setDescription(`${videos.map(video2 => `**\`${++index}\`  |**  ${video2.title}`).join("\n")}`)
                        .setFooter("Please choose one of the following 10 results, this embed will auto-deleted in 15 seconds");
                    // eslint-disable-next-line max-depth
                    message.channel.send(embedPlay).then(m => m.delete({
                        timeout: 15000
                    }))
                    try {
                        var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                            max: 1,
                            time: 15000,
                            errors: ["time"]
                        });
                    } catch (err) {
                        console.error(err);
                        return message.channel.send("The song selection time has expired in 15 seconds, the request has been canceled.");
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return message.channel.send("🆘  **|**  I could not obtain any search results");
                }
            }
            response.delete();
            return handleVideo(video, message, voiceChannel);
        }

    } else if (command === "skip") {
        if (!message.member.voice.channel) return message.channel.send("I'm sorry, but you need to be in a voice channel to skip a music!");
        if (!serverQueue) return message.channel.send("There is nothing playing that I could skip for you");
        serverQueue.connection.dispatcher.end("[runCmd] Skip command has been used");
        return message.channel.send("⏭️  **|**  I skip this song for you");

    } else if (command === "stop") {
        if (!message.member.voice.channel) return message.channel.send("I'm sorry but you need to be in a voice channel to play music!");
        if (!serverQueue) return message.channel.send("There is nothing playing that I could stop for you");
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end("[runCmd] Stop command has been used");
        return message.channel.send("⏹️  **|**  Deleting queues and leaving voice channel...");

    } else if (command === "volume" || command === "vol") {
        if (!message.member.voice.channel) return message.channel.send("I'm sorry, but you need to be in a voice channel to set a volume!");
        if (!serverQueue) return message.channel.send("There is nothing playing");
        if (!args[1]) return message.channel.send(`The current volume is: **\`${serverQueue.volume}%\`**`);
        if (isNaN(args[1]) || args[1] > 100) return message.channel.send("Volume only can be set in a range of **\`1\`** - **\`100\`**");
        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolume(args[1] / 100);
        return message.channel.send(`I set the volume to: **\`${args[1]}%\`**`);

    } else if (command === "nowplaying" || command === "np") {
        if (!serverQueue) return message.channel.send("There is nothing playing");
        return message.channel.send(`🎶  **|**  Now Playing: **\`${serverQueue.songs[0].title}\`**`);

    } else if (command === "queue" || command === "q") {
        if (!serverQueue) return message.channel.send("There is nothing playing");
        let embedQueue = new MessageEmbed()
            .setColor("BLUE")
            .setAuthor("Song queue", message.author.displayAvatarURL())
            .setDescription(`${serverQueue.songs.map(song => `**-** ${song.title}`).join("\n")}`)
            .setFooter(`• Now Playing: ${serverQueue.songs[0].title}`);
        return message.channel.send(embedQueue);

    } else if (command === "pause") {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return message.channel.send("⏸  **|**  Paused the music for you");
        }
        return message.channel.send("There is nothing playing");

    } else if (command === "resume") {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send("▶  **|**  Resumed the music for you");
        }
        return message.channel.send("There is nothing playing");
    } else if (command === "loop") {
        if (serverQueue) {
            serverQueue.loop = !serverQueue.loop;
            return message.channel.send(`🔁  **|**  Loop is **\`${serverQueue.loop === true ? "enabled" : "disabled"}\`**`);
        };
        return message.channel.send("There is nothing playing");
    }
});

async function handleVideo(video, message, voiceChannel, playlist = false) {
    const serverQueue = queue.get(message.guild.id);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 100,
            playing: true,
            loop: false
        };
        queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`[ERROR] I could not join the voice channel, because: ${error}`);
            queue.delete(message.guild.id);
            return message.channel.send(`I could not join the voice channel, because: **\`${error}\`**`);
        }
    } else {
        serverQueue.songs.push(song);
        if (playlist) return;
        else return message.channel.send(`<:yes:591629527571234819>  **|**  **\`${song.title}\`** has been added to the queue`);
    }
    return;
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        return queue.delete(guild.id);
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url))
        .on("finish", () => {
            const shiffed = serverQueue.songs.shift();
            if (serverQueue.loop === true) {
                serverQueue.songs.push(shiffed);
            };
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolume(serverQueue.volume / 100);

    serverQueue.textChannel.send({
        embed: {
            color: "BLUE",
            description: `🎶  **|**  Start Playing: **\`${song.title}\`**`
        }
    }).then(m => m.delete({
      timeout: 5000
    }));
}


client.login(TOKEN)
