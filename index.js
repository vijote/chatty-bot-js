import { Client, Intents } from 'discord.js';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const API_URL = 'https://api-inference.huggingface.co/models/vijote/DialoGPT-small-Morty';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

client.on('message', async message => {
    // ignore messages from the bot itself
    if (message.author.bot) {
        return;
    }
    // form the payload
    const payload = {
        inputs: {
            text: message.content
        }
    };
    // form the request headers with Hugging Face API key
    const headers = {
        'Authorization': 'Bearer ' + process.env.HUGGINGFACE_TOKEN
    };

    // set status to typing
    message.channel.sendTyping()
    // query the server
    const res = await fetch(API_URL, {
        method: 'post',
        body: JSON.stringify(payload),
        headers: headers
    });
    const data = await res.json();
    const botMsg = data.generated_response ? data.generated_response : `I don't know what to say...`;
    await message.channel.send(botMsg)
})

client.login(process.env.DISCORD_TOKEN);