const TelegramBot =  require('node-telegram-bot-api')  

const {botToken}  = require('./config/botConfig')  

const bot = new TelegramBot(botToken,{polling:true}) 

bot.on('message',(msg) =>{
    const chatId = msg.chat.id ; 
    bot.sendMessage(chatId,'Hello ! My name is Javis, your smart Bot')
})