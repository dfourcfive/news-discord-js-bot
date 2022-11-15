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


const args=['country','lang'];

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
 

  
client.on("messageCreate", message => {


   if (message.content.startsWith("$New")) {
    
      if(isCommandeWithArgs(message.content)){
        let country = getArgumentByKey('country',message.content);
        let lang = getArgumentByKey('lang',message.content);
        getNews(country,lang).then( async news =>  {
          if(news != null){
            if(news['link'] != null){
              await message.channel.send(news['link']+"\n"+news['title']+"\n"+news['description']);
            }else{
              await message.channel.send(news['title']);
            }
          }
      });
      }else{
        getNews().then( async news =>  {
          if(news != null){
            if(news['link'] != null){
              await message.channel.send(news['link']+"\n"+news['title']+"\n"+news['description']);
            }else{
              await message.channel.send(news['title']);
            }
          }
      });
      }
      
      }
});


client.login(process.env.TOKEN);

  function getNews(country,lang){
    let url=`https://newsdata.io/api/1/news?apikey=${process.env.KEY}`;
    if(country != null){
      url=url+"&country="+country;
    }else{
      url=url+"&country=ca,us";
    }

    if(lang != null){
      url=url+"&language="+lang;
    }else{
      url=url+"&language=en,fr";
    }

    return got(url, { json: true }).then(response  => {
        return response.body
    }).then(data=>{
       return data['results'][0]
    }).catch(error => {
      console.log(error);
    });
  }


  function getArgumentByKey(key ,message){
    var argumentValue;
    if(message.includes(key)){
      let values = message.split('-');
      for (let index = 0; index < values.length; index++) {
        if(values[index].includes(key)){
          argumentValue=  values[index].substring(key.length).replace(' ', '');
        }
      }
    }
    return argumentValue;
  }

  function isCommandeWithArgs(message){
    var argumentValue=false;
    for (let index = 0; index < args.length; index++) {
      if(message.includes(args[index])){
        argumentValue=  true;
      }
    }
    return argumentValue;
  }