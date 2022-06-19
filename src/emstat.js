require('dotenv').config({path:'./my.env'});

const Discord = require('discord.js');
const SQLiteDatabase = require("./sqlDatabase");

const db = new SQLiteDatabase();

const client = new Discord.Client();

client.on("message", async (message) => {
    try {
        await onMessage(message);
    }
    catch (err) {
        console.log("Invalid message:", err);
    }
});

client.on("messageReactionAdd", async (reaction, user) => {
    try {
        await onAddedReaction(reaction);
    }
    catch(err) {
        console.log("Unable to parse added reaction:", err);
    }
});

client.on("messageReactionRemove", async (reaction, user) => {
    try {
        await onRemovedReaction(reaction);
    }
    catch(err) {
        console.log("Unable to parse removed reaction:", err);
    }
});

async function onMessage(message) {
    const prefix = "_";
    const cmdTypes = {
        stats: 'stats',
        clearStats: 'clear-stats',
        help: 'help',
        // changePrefix: 'change-prefix', TBD
    }
    cmdTypes.toString = () => {
        return `\n'${cmdTypes.help}',`
        + `\n'${cmdTypes.stats}' to see general statistics,`
        + `\n'${cmdTypes.clearStats}' to clear statistics,`;
    };

    if (message.content.startsWith(`${prefix}${cmdTypes.stats}`)) {
        await getStats(message);
    }
    else if (message.content.startsWith(`${prefix}${cmdTypes.clearStats}`)) {
        await clearStats(message);
    }
    else if (message.content.startsWith(`${prefix}${cmdTypes.help}`)) {
        await message.channel.send("You can use the following commands:"
            + cmdTypes.toString()
            + "\nThe current command prefix is " + prefix);
    }
}

async function onAddedReaction(reaction) {
    let emoji = reaction.emoji.name;
    let author = reaction.message.author;

    if (author.bot) {
        return;
    }

    await db.addToScore(emoji, author, 1);

    if (emoji == "📌") {
        await pinMessage(reaction.message);
    }
}

async function onRemovedReaction(reaction) {
    let emoji = reaction.emoji.name;
    let author = reaction.message.author;

    if (author.bot) {
        return;
    }

    await db.addToScore(emoji, author, -1);
}

async function getStats(message) {
    let emoji = message.content.substring(7);
    try {
        let data = await db.getScore(emoji);
        let results = data
            .map(score => score.username + ": " + score.points)
            .join("\n");
        let response = "Stats for " + emoji + " are as follows:\n" + results;
        message.channel.send(response);
    }
    catch (err) {
        console.error(err);
    }
}

async function clearStats(message) {
    if (!isVerifiedAdmin(message)) {
        return;
    }

    await db.clear();
    message.channel.send("Cleared");
}

function isVerifiedAdmin(message) {
    if (message.author.id !== process.env.ownerId) {
        message.channel.send(message.author.username + " does not have permission to clear stats");
        return false;
    }

    return true;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

client.on('error', console.error);

async function start() {
    await db.load();
    console.log("Starting login");
    await client.login(process.env.TOKEN);
    console.log('Logged in to Discord');
}

start();