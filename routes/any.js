var ejs;
const {readFile, writeFile, readdir} = require('fs').promises;
const {preparepack, preparedata} = require("../functions.js");

ejs = require("ejs");
m = require("../make.js");

// directory paths
const du = '/home/ubuntu/aes.dev/users/';
const ds = '/home/ubuntu/aes.dev/snippets/';
const dd = '/home/ubuntu/aes.dev/documents/';
const df = '/home/ubuntu/aes.dev/files/';
const dx = '/home/ubuntu/aes.dev/xi/'; // ?
const dsp = '/home/ubuntu/aes.dev/splices/';
const da = '/home/ubuntu/aes.dev/data/';
const dr = '/home/ubuntu/aes.dev/routes/';

module.exports = function(server) {
    server.get('/:any', async function (req, res) {
        let data;
        let filenames = await readdir(df, 'utf8');  // ar
        let notsent = true;
        let ip = await readFile(da + 'ip.txt', 'utf8');
        for (i = 0; i < filenames.length; i++) {
            if (req.params.any == filenames[i]) {  // st
                res.sendFile(df + req.params.any);
                notsent = false;
            }
        }
        if (notsent) {
            let documentnames = await readdir(dd, 'utf8'); // ar
            for (i = 0; i < documentnames.length; i++) {
                if (req.params.any == documentnames[i]) { // str
                    if (req.ip == ip) {
                        pack = await preparepack('view', 'view ' + req.params.any, req.params.any, 'document',
                        { content: dd + req.params.any, options: du + 'Aes/options' });
                        res.send(pack);
                    } else {
                        pack = await preparepack('view', 'view ' + req.params.any, req.params.any, 'document',
                        { content: dd + req.params.any, options: da + 'options' });
                        res.send(pack);
                    }
                    notsent = false;
                }
            }
            /*
            let notenames = await readdir(dx, 'utf8'); // ar
            for (i = 0; i < notenames.length; i++) {
                if (req.params.any == notenames[i]) { // str
                    if (req.ip == ip) {
                        pack = await preparepack('view', 'view ' + req.params.any, req.params.any, 'xi',
                        { content: dx + req.params.any, options: du + 'Aes/options' });
                        res.send(pack);
                    } else {
                        pack = await preparepack('view', 'view ' + req.params.any, req.params.any, 'xi',
                        { content: dx + req.params.any, options: da + 'options' });
                        res.send(pack);
                    }
                    notsent = false;
                }
            }
            let splicenames = await readdir(dsp, 'utf8'); // ar
            for (i = 0; i < splicenames.length; i++) {
                if (req.params.any == splicenames[i]) { // str
                    if (req.ip == ip) {
                        pack = await preparepack('view', 'view ' + req.params.any, req.params.any, 'splice',
                        { content: dsp + req.params.any, options: du + 'Aes/options' });
                        res.send(pack);
                    } else {
                        pack = await preparepack('view', 'view ' + req.params.any, req.params.any, 'splice',
                        { content: dsp + req.params.any, options: da + 'options' });
                        res.send(pack);
                    }
                    notsent = false;
                }
            }
            */
            if (req.params.any == "options" && notsent) {
                if (req.ip == ip) {
                    pack = await preparepack('view', 'view ' + req.params.any, req.params.any, 'user',
                    { content: dd + req.params.any, options: du + 'Aes/options' });
                    res.send(pack);
                } else {
                    //data = await preparedata(da + 'options', dd + USER req.params.any, 'view ' + req.params.any);
                    //pack = ejs.render(await m('view'), data);
                    //res.send(pack);
                }
                notsent = false;
            }
            if (req.params.any == "commands.txt" && notsent) {
                if (req.ip == ip) {
                    pack = await preparepack('view', 'view ' + req.params.any, req.params.any, 'user',
                    { content: du + 'Aes/' + req.params.any, options: du + 'Aes/options' });
                    res.send(pack);
                } else {
                    //data = await preparedata(da + 'options', dd + USER req.params.any, 'view ' + req.params.any);
                    //pack = ejs.render(await m('view'), data);
                    //res.send(pack);
                }
                notsent = false;
            }
        };
        if (notsent) {
            if (req.ip == ip) {
                pack = await preparepack('view', 'view notfound', 'notfound', 'document', { content: dd + 'notfound', options: du + 'Aes/options' });
                res.send(pack);
            } else {
                pack = await preparepack('view', 'view notfound', 'notfound', 'document', { content: dd + 'notfound', options: da + 'options' });
                res.send(pack);
            }
        }
    });
}
