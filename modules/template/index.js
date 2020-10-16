const { Client } = require('discord.js');
const bot = new Client();
const { commands: botCommands, init: botInit } = require('./main');
const TOKEN = 'token goes here';

bot.on('ready', () => {
  console.info(`Hi! I'm online.`);

  if (botInit) botInit();
});

const commands = {
  startsWith: [],
  exact: [],
  includes: []
};

botCommands.forEach(command => {
  const type = command.type || 'exact';
  if (!commands[type]) commands[type] = [];
  commands[type].push(command);
})

bot.on('message', msg => {

  if (msg.author.bot) return;

  // starts with phrase
  commands['startsWith'].forEach(command => {
    if (msg.content.startsWith(command.phrase)) {
      command.function(msg);
      return;
    }
  })

  // exact phrase
  commands['exact'].forEach(command => {
    const phrases = command.phrase.split('||').map(text => text.trim());
    phrases.forEach(phrase => {
      if (msg.content == phrase) {
        command.function(msg);
        return;
      }
    })
  })

  // includes phrase
  commands['includes'].forEach(command => {
    const { phrase } = command;

    if (phrase.includes('||')) {
      const phrases = phrase.split('||').map(text => text.trim());
      phrases.forEach(phrase => {
        if (msg.content.includes(phrase)) {
          command.function(msg);
          return;
        }
      })
    } else if (phrase.includes('&&')) {
      const phrases = phrase.split('&&').map(text => text.trim());
      let allIncluded = true;

      phrases.forEach(phrase => {
        if (!msg.content.includes(phrase)) allIncluded = false;
      })

      if (allIncluded) {
        command.function(msg);
        return;
      }

    } else if (msg.content.includes(command.phrase)) {
      command.function(msg);
      return;
    }
  })

});

bot.login(TOKEN);