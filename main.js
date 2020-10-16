const { Client } = require('discord.js');
const fs = require('fs');

const bot = {
    client: new Client(),
    configPath: './config.json',
}

bot.getConfig = function () {
    if (!fs.existsSync(this.configPath)) {
        fs.writeFileSync(this.configPath, JSON.stringify({ "token": "token here" }, null, 2));
        console.log(`Config file created at ${this.configPath}`);
    }

    this.config = JSON.parse(fs.readFileSync(this.configPath));

    if (!this.config.token || this.config.token == 'token here') {
        console.log(`Config file at ${this.configPath} is missing Discord bot token`);
        process.exit();
    }

    return this.config;
}

bot.setConfig = function (prop, value) {
    this.config[prop] = value;
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
}

bot.loadModule = function (moduleName) {
    if (!(moduleName in this.modules)) {
        const path = this.config.moduleDirectory + '/' + moduleName + '/main.js';
        if (fs.existsSync(path)) {
            const module = require(path);

            module.commands.forEach(command => {
                const type = command.type || 'exact';
                command[module] = moduleName;
                if (!this.commands[type]) this.commands[type] = [];
                this.commands[type].push(command);
            })

            this.moduleNames.push(moduleName);
            this.modules[moduleName] = module;

        }
    }
}

bot.loadModules = function () {
    this.config.activeModules.forEach(moduleName => {
        this.loadModule(moduleName)
    })
}

bot.setListeners = function () {
    this.client.on('ready', () => {
        console.log(`I'm online!`)

        // module inits
        this.moduleNames.forEach(moduleName => {
            if (this.modules[moduleName].init) this.modules[moduleName].init(this);
        })


    })

    this.client.on('message', msg => {
        if (msg.author.bot) return;

        // starts with phrase
        this.commands['startsWith'].forEach(command => {
            if (msg.content.startsWith(command.phrase)) {
                command.function(msg);
                return;
            }
        })

        // exact phrase
        this.commands['exact'].forEach(command => {
            const phrases = command.phrase.split('||').map(text => text.trim());
            phrases.forEach(phrase => {
                if (msg.content == phrase) {
                    command.function(msg);
                    return;
                }
            })
        })

        // includes phrase
        this.commands['includes'].forEach(command => {
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

    })
}

bot.init = function () {
    this.config = this.getConfig();
    this.moduleNames = []
    this.modules = {};
    this.commands = {
        startsWith: [],
        exact: [],
        includes: []
    };
    this.loadModules();
    this.setListeners();
    this.client.login(this.config.token);
}

module.exports = bot;