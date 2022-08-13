var ejs;
const {readFile, writeFile, readdir} = require('fs').promises;
const {preparedata} = require("../functions.js");

ejs = require("ejs");
m = require("../make.js");

// directory paths
const du = '/home/ubuntu/aes.dev/users/';
const ds = '/home/ubuntu/aes.dev/snippets/';
const dup = '/home/ubuntu/aes.dev/upload/';
const dd = '/home/ubuntu/aes.dev/documents/';
const df = '/home/ubuntu/aes.dev/files/';
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
                res.send(df + req.params.any);
                notsent = false;
            }
        }
        if (notsent) {
            let documentnames = await readdir(dd, 'utf8'); // ar
            for (i = 0; i < documentnames.length; i++) {
                if (req.params.any == documentnames[i]) { // str
                    if (req.ip == ip) {
                        data = await preparedata(du + 'Aes/options', dd + req.params.any, 'view ' + req.params.any);
                        pack = ejs.render(await m('view'), data);
                        res.send(pack);
                    } else {
                        data = await preparedata(da + 'options', dd + req.params.any, 'view ' + req.params.any);
                        pack = ejs.render(await m('view'), data);
                        res.send(pack);
                    }
                    notsent = false;
                }
            }
            if (req.params.any == "options" && notsent) {
                if (req.ip == ip) {
                    data = await preparedata(du + 'Aes/options', du + 'Aes/options', 'view ' + req.params.any);
                    pack = ejs.render(await m('view'), data);
                    res.send(pack);
                } else {
                    //data = await preparedata(da + 'options', dd + req.params.any, 'view ' + req.params.any);
                    //pack = ejs.render(await m('view'), data);
                    //res.send(pack);
                }
                notsent = false;
            }
        };
        if (notsent) {
            if (req.ip == ip) {
                data = await preparedata(du + 'Aes/options', dd + 'notfound', 'view notfound');
                pack = ejs.render(await m('view'), data);
                res.send(pack);
            } else {
                data = await preparedata(da + 'options', dd + 'notfound', 'view notfound');
                pack = ejs.render(await m('view'), data);
                res.send(pack);
            }
        }
    });
}
