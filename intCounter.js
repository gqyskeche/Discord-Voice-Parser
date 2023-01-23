// DO NOT TOUCH | initialization for establishment of connection to bot and various libraries
const { Client, Intents } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { addSpeechEvent } = require("discord-speech-recognition");
const { VoiceConnection } = require("discord.js");
const { createAudioPlayer } = require('@discordjs/voice'); // For playing an audio clip
const fs = require('fs'); // File reading and writing
const { join } = require('node:path');
const { createAudioResource, StreamType } = require('@discordjs/voice');


// Self variables
const PREFIX = '!'
const player = createAudioPlayer();
var connected = false;
var messageChannel = ""
var keywords = ["int", "inting", "inter", "apple"];
var commands = ["join", "leave", "sc", "write", "counter", "deafen", "reset", "play"]   // Just for ease of access
var counter;
var checkingKeywords = false;
var deafen = false;


// Declaration of intents
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});
addSpeechEvent(client);

// Command recognition

client.on("messageCreate", (msg) => {
  const content = msg.content;
  if (content == "!join" || content == "!leave" || content == "!play") {     // if the voice related commands are used
    if (!connected && content == "!leave"){
        msg.channel.send("I'm not in a voice channel");
        return ;
    }
    if (messageChannel == ""){
      msg.channel.send("Logging channel not set, please use !setchannel or !sc");
      return ;
  }
    const voiceChannel = msg.member?.voice.channel;
    connected = true;
    if (content == "!join"){
      msg.channel.send("Connected");
    }
      if (voiceChannel) {
        const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfDeaf: false,  
        });
        //msg.channel.send("check1");
        if (connected && content == "!play"){
          //msg.channel.send("check2");
          let resource = createAudioResource("C:\\Users\\gqysk\\discord_bot\\Malding.mp3");
          player.play(resource);
          connection.subscribe(player);
        }

        if (content == "!leave") {     // if the !leave command is not used, do not join vc
            connected = false;
            connection.destroy()  
            msg.channel.send("Disconnected succesfully");
        }
    }
  }
  if (content == "!setchannel" || content == "!sc"){
    msg.channel.send("Channel set to " + msg.channel.name)
    messageChannel = msg.channel
  }
  
  if (content == "!write" || content == "!w"){
    console.log("this command is now obsolete")
  }

  if (content == "!counter" || content == "!c"){
    msg.channel.send("Number of times int(or other keywords) has been said: " + counter.toString());
  }

  if (content == "!deafen" || content == "!d"){
    if (deafen){
      msg.channel.send("The bot is now undeafened and will record voice, use !deafen or !d to deafen it");
    } else {
      msg.channel.send("The bot is now deafened and will not record voice, use !deafen or !d to undeafen it");
    }
    
    deafen = !deafen;
  }

  if (content == "!reset" || content == "!r"){
    fs.writeFile('/Users/gqysk/discord_bot/intcounter.txt', "0", err => {      // Write to file the new counter
      if (err) {
        console.error(err);
    
      }
      counter = 0;
      msg.channel.send("Successfully reset the counter")
      // file written successfully
    });
  }

  if (content == "!keywords" || content == "!k"){
    for (i = 0; i < keywords.length; i++)
    msg.channel.send((i+1) + ": " + keywords[i]);
  }

  if (content == "!keywords" || content == "!k"){
    array.forEach(element => {
      msg.channel.send((i+1) + ": " + element);
    });
  }


});

// Scraping the setchannel for the keyword
client.on("messageCreate", (msg) => {
  var words = msg.content.split(" ");
  if (checkingKeywords && msg.author == client.user.id){  // Makes sure the bot is only parsing the bots messages and only parsing the speech to text messages
    words.forEach(function (element, index) { 
      if (keywords.includes(element.toLowerCase())){  // If a split word matches one of the keywords, add 1 each time
        msg.channel.send("Successfully counted");     
        counter += 1
      }
    });
    fs.writeFile('/Users/gqysk/discord_bot/intcounter.txt', counter.toString(), err => {      // Write to file the new counter
      if (err) {
        console.error(err);
    
      }
      // file written successfully
    });
  }
  checkingKeywords = false;
});

// Recognization the speech and outputting it to designated channel with author
client.on("speech", (msg) => {
  if (!(msg.content == undefined || deafen)){
    if (!(messageChannel == "")){
      checkingKeywords = true;
      messageChannel.send(msg.author.username + ": " + msg.content);
    } 
  }
});

// Indicates ready status of bot
client.once("ready", () => {
  console.log("Ready!");
  fs.readFile('/Users/gqysk/discord_bot/intcounter.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    counter = parseInt(data); 
  });
});

// Bot token
client.login("OTcyMjUyOTI3NTgwMzIzODYw.GuK2M3.IY54gRxvzl7x6OGJQmYxIHNYQk_JQoq05p7Njg");


