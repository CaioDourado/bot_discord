const Discord = require('discord.js');
const request = require('request');
const cliente = new Discord.Client();
const config  = require('./config.json');

const api_financeira = 'https://economia.awesomeapi.com.br/';
const api_noticias = 'https://newsapi.org/v2/top-headlines?sources=globo&apiKey=INSIRA_SUA_CHAVE_AQUI';

cliente.on("ready",() => {
    console.log(`Bot foi iniciado, com ${cliente.users.size} usuarios, em ${cliente.channels.size} canais, em ${cliente.guilds.size} servidores.`);
    cliente.user.setActivity(`Digite !dolar`);
});

cliente.on("guildCreate",guild => {
    console.log(`O bot entrou nos servidores: ${guild.name} (id: ${guild.id}). População ${guild.memberCount} membros`);
    cliente.user.setActivity(`Estou em ${cliente.guilds.size} servidores.`);
});

cliente.on("guildDelete", guild =>{
    console.log(`O bot foi removido do servidor ${guild.name} (id: ${guild.id})`);
    cliente.user.setActivity();
});

cliente.on("message", async message => {
    if(message.author.bot) return;
    //if(message.channel.type === "dm") return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();
    const comandos = ["CNY","AUD","ILS","EUR","USD","GBP","BTC","CAD","ARS","LTC","JPY","USD","CHF"];

    let check_comando = comandos.indexOf(comando.toUpperCase());
    if(check_comando>-1){
        const m = await message.channel.send("Estamos verificando...");
        request(api_financeira+"all", { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            let retorno = body[comando.toUpperCase()];
            m.edit(`O ${retorno.name} teve mímima de ${retorno.low} e máxima de ${retorno.high} hoje.`);
        });
    }

    if(comando === "moedas"){
        const m = await message.channel.send("Estamos verificando o Dólar...");
        request(api_financeira+"all", { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            let moedas = "";
            let retorno = body;
            for(let key in retorno){
                moedas += key+" - "+retorno[key].name+"\n";
            }
            m.edit("As Moedas Disponiveis São: \n "+moedas+"");
        });
    }

    if(comando === "noticias"){
        const m = await message.channel.send("Estamos verificando as noticias...");
        request(api_noticias, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            let envio = "\n";
            let retorno = body.articles;
            for(let i=0;i<retorno.length;i++){
                envio += `${i+1}. ${retorno[i].title} \n`;
            }
            m.edit(envio);
        });
    }
});

cliente.login(config.token);