const config = require("../../config.json");
const logger = require("../logger");
const Dropbox = require('dropbox');
const dbx = new Dropbox({ accessToken: config.dropboxToken });
const fs = require('fs');

module.exports = class LogsCommand {
    constructor(client) {
        Object.assign(this, {
            name: 'logs',
            group: 'Информация',
            description: 'Загружает на Dropbox логи удаления/редактирования сообщений и выдаёт ссылку на них',
            client
        });
    }
    
    async run(msg) {
        try {
            await msg.channel.send('Загружаю логи на Dropbox...');
            const logs1 = fs.readFileSync('Logs/Deleted messages.txt', 'utf8');
            await dbx.filesUpload({ path: '/Logs/Deleted messages.txt', contents: logs1, mode: 'overwrite' });
            const link1 = await dbx.sharingCreateSharedLink({ path: '/Logs/Deleted messages.txt' });
            const logs2 = fs.readFileSync('Logs/Edited messages.txt', 'utf8');
            await dbx.filesUpload({ path: '/Logs/Edited messages.txt', contents: logs2, mode: 'overwrite' });
            const link2 = await dbx.sharingCreateSharedLink({ path: '/Logs/Edited messages.txt' });
            await msg.channel.send('Удаление сообщений - ' + link1.url + '\nИзменение сообщений - ' + link2.url);
            logger.debug('Команда была успешно обработана');
        } catch(err) {
            msg.channel.send("Во время обработки вашей команды произошла ошибка");
            logger.error("Произошла ошибка", err);
        }
    }
    
    async parseParam(msg) {
        this.run(msg);
    }
}
