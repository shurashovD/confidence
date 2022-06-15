const log = require('simple-node-logger').createSimpleLogger()
const logFile = require('simple-node-logger').createSimpleLogger('project.log')
const config = require('config')
//const TelegramBot = require('node-telegram-bot-api')

//const token = config.SabinaKnaubBotToken
//const chatId = config.telegramDevChatId

//const bot = new TelegramBot(token, {polling: true})

log.info = msg => {
    if ( process.env.LEVEL === 'develop' ) {
        console.log(msg)
    }
    if ( process.env.LEVEL === 'production' ) {
        logFile.info(msg)
        try {
            //bot.sendMessage(chatId, msg)
        }
        catch (e) {
            logFile.error(e)
        }
    }
}

log.error = msg => {
    if ( process.env.LEVEL === 'develop' ) {
        console.log(msg)
    }
    if ( process.env.LEVEL === 'production' ) {
        logFile.info(msg)
        try {
            //bot.sendMessage(chatId, msg)
        }
        catch (e) {
            logFile.error(e)
        }
    }
}

log.fatal = msg => {
    if ( process.env.LEVEL === 'develop' ) {
        console.log(msg)
    }
    if ( process.env.LEVEL === 'production' ) {
        logFile.info(msg)
        try {
            //bot.sendMessage(chatId, msg)
        }
        catch (e) {
            logFile.error(e)
        }
    }
}

log.warn = msg => {
    if ( process.env.LEVEL === 'develop' ) {
        console.log(msg)
    }
    if ( process.env.LEVEL === 'production' ) {
        logFile.info(msg)
        try {
            //bot.sendMessage(chatId, msg)
        }
        catch (e) {
            logFile.error(e)
        }
    }
}

module.exports = log