# modular-bot

modular-bot is a Discord bot that allows you to combine the features of various Discord bots to run as one bot.

# how to use

```
git clone https://github.com/sylv-ia/modular-bot.git

npm i

cd modular-bot 
```

In the config.json file, replace "token goes here" with your Discord bot token
```
{
  "token": "token goes here",
  "moduleDirectory": "./modules",
  "activeModules": [
    "template"
  ]
}
```

Run the bot
```
node .
```

# modules

By default, modules go in the modules folder. Modules are Discord bots on their own, but thanks to how theey're formatted, they work seamlessly with modular-bot. 

modular-bot is included with a sample module called template. The template module demonstrates the 3 types of commands modular-bot supports: 

If you'd like to use a module on its own, add your Discord bot token to the module's index.js file. Replace "token goes here" on line 4 with your token.

```
const TOKEN = 'token goes here';
```

# adding a new module 

1. Place the module into the modules folder
2. Add the new module's folder name to the activeModules list in config.json
```
{
  "token": "token goes here",
  "moduleDirectory": "./modules",
  "activeModules": [
    "template",
    "nameOfModule"
  ]
}
```
3. Run modular-bot 
```
node .
```

# creating a new module

You can use the template module as a template. 

All the bot's commands go in main.js. There are two parts to main.js: init and commands.

The init function runs once, when the bot goes online. The function recieves the bot object. 

bot.client is the Discord client
```js
const init = (bot) => {
    //runs on bot ready
}
```

The commands array is where the bot commands go. Commands are javascript objects with 4 properties: phrase, type, description, and function. 

Phrase is the phrase used to trigger that command. Function is the function that runs when the command is triggered. 

modular-bot supports 3 types of commands: exact, includes, startsWith. 

Exact commands run if a meessage is equal to the phrase string.
Includes commands run if a meessage includes the phrase string. StartsWith commands run if a meessage starts with the phrase string.

The command types are all aptly named, really. 

```js
const commands = [
    {
        phrase: 'exact',
        type: 'exact',
        description: "runs if your message is 'exact'",
        function: (msg) => {
            msg.channel.send('hi');
        },
    },
    {
        phrase: 'includes',
        type: 'includes',
        description: "runs if message includes 'includes'",
        function: (msg) => {
            msg.channel.send("your message includes 'includes'");
        },
    },
    {
        phrase: 'start',
        type: 'startsWith',
        description: "runs if message starts with 'start'",
        function: (msg) => {
            msg.channel.send("your message starts with 'start'");
        },
    },
]
```

# Licence
MIT