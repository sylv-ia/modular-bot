const init = (bot) => {
    //runs on bot ready
}

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

module.exports = {
    init: init,
    commands: commands,
}

