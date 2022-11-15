const { Client, GatewayIntentBits } = require('discord.js');
require("dotenv").config();
const got = require('got');
const client = new Client({ partials: ["CHANNEL", "MESSAGE"],intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildIntegrations,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.DirectMessageReactions,
  GatewayIntentBits.GuildMessageReactions

] });


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
 

  
client.on("messageCreate", message => {
    console.log(message.cleanContent);
    console.log("messageCreate");
    if (message.content === "$New") {
      getNews().then( async news =>  {
          if(news != null){
            if(news['image_url'] != null){
              await message.channel.send(news['image_url']+"\n"+news['title']);
            }else{
              await message.channel.send(news['title']);
            }
          }
      });
      }
});

client.login(process.env.TOKEN);

  function getNews(){
    const url=`https://newsdata.io/api/1/news?apikey=${process.env.KEY}&country=au,ca,fr,us&language=en`;

    return got(url, { json: true }).then(response  => {
        return response.body
    }).then(data=>{
       return data['results'][0]
    }).catch(error => {
      console.log(error);
    });
  }