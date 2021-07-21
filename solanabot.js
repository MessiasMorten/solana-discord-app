//Dependencies
const { Client } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios'); 

// Load config
dotenv.config();

const bot = new Client();
let token = String(process.env.SOLANA_BOT_TOKEN);
let apikey = String(process.env.SOLANA_BOT_APIKEY);
bot.login(token);

let botobj;
let guildmember;

//Fetch user and member object of bot

bot.on('ready', () => {

    bot.user.setActivity('SOL @ Binance', ({type: "WATCHING"}));

    bot.users.fetch('859089606737002547').then((user) => {
        botobj = user;
    
        const guild = bot.guilds.cache.get('859080868626300968');
        guildmember = guild.member(botobj);

    }).catch(console.error);

    let currentprice, change, jsondata, newcurrentprice, newchange, newchangestr, newchangeint;

    //Get pricing data
    setInterval(() => {

        try {
            
            require('axios')
            .get("https://api.binance.com/api/v3/ticker/24hr?symbol=SOLUSDT")
            .then(response => jsondata = response.data) 

            currentprice = jsondata['lastPrice'];
            change = jsondata['priceChangePercent'];

            //Trim price and change strings
            const price = currentprice.split(".");
            
            let p1 = price[0];
            let p2 = price[1];

            p2 = p2.substring(0,2);

            newcurrentprice = p1 + "." + p2;
            newchangestr = change.substring(0,4);
            newchangeint = parseInt(newchangestr);

            //Build up name change for bot
            let botname;
            let bear = guildmember.guild.roles.cache.find(r => r.name === "botbear");
            let bull = guildmember.guild.roles.cache.find(r => r.name === "botbull");

            //Positive
            if (newchangeint >= 0) {

                botname = newcurrentprice + " +" + newchangestr + "%";
                guildmember.setNickname(botname);
                try {
                    guildmember.roles.add(bull);
                    guildmember.roles.remove(bear);
                } catch {

                }

            
            //Negative    
            } else {

                botname = newcurrentprice + " " + newchangestr + "%";
                guildmember.setNickname(botname);

                try {
                    guildmember.roles.add(bear);
                    guildmember.roles.remove(bull);
                } catch {
                    
                }

            }

        } catch {
            console.log(jsondata);
        }



    }, 1000);

    

});
